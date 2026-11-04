const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  const cleanName = String(fullName).trim().substring(0, 100);
  const cleanEmail = String(email).trim().toLowerCase().substring(0, 255);
  const cleanPhone = String(phone).trim().substring(0, 20);
  const cleanPass = String(password);

  if (cleanPass.length < 6 || cleanPass.length > 128) {
    return res.status(400).json({ status: 'error', message: 'Password must be between 6 and 128 characters.' });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
    return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(cleanPass, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const result = await db.query(
      `INSERT INTO users (full_name, email, phone, password_hash, verification_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, phone, is_email_verified, role, created_at`,
      [cleanName, cleanEmail, cleanPhone, passwordHash, verificationToken]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully. Please verify your email.',
      token,
      user,
      verificationToken,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ status: 'error', message: 'An account with this email or phone already exists.' });
    }
    console.error('[Register Error]', err);
    res.status(500).json({ status: 'error', message: 'Internal server error during registration.' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { emailOrPhone, password, otp } = req.body;

  if (!emailOrPhone) {
    return res.status(400).json({ status: 'error', message: 'Email or phone is required.' });
  }

  try {
    const isEmail = emailOrPhone.includes('@');
    const queryField = isEmail ? 'email' : 'phone';
    const cleanIdentifier = isEmail ? emailOrPhone.trim().toLowerCase() : emailOrPhone.trim();

    const userRes = await db.query(`SELECT * FROM users WHERE ${queryField} = $1`, [cleanIdentifier]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials. User not found.' });
    }

    const user = userRes.rows[0];

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid email/phone or password.' });
      }
    } else if (otp) {
      if (!user.otp_code || user.otp_code !== otp || new Date() > new Date(user.otp_expires)) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired OTP code.' });
      }
      await db.query(`UPDATE users SET otp_code = NULL, otp_expires = NULL WHERE id = $1`, [user.id]);
    } else {
      return res.status(400).json({ status: 'error', message: 'Please provide either password or OTP.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.is_email_verified,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    res.status(500).json({ status: 'error', message: 'Server error during login.' });
  }
});

router.post('/send-otp', authLimiter, async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ status: 'error', message: 'Phone number is required.' });

  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      `INSERT INTO users (full_name, email, phone, otp_code, otp_expires)
       VALUES ('Client User', $1, $2, $3, $4)
       ON CONFLICT (phone) DO UPDATE 
       SET otp_code = $3, otp_expires = $4`,
      [`guest_${phone}@dukaan.in`, phone.trim(), otp, expires]
    );

    res.json({
      status: 'success',
      message: 'OTP dispatched successfully.',
      expiresInSeconds: 300,
    });
  } catch (err) {
    console.error('[Send OTP Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to dispatch verification code.' });
  }
});

router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: 'error', message: 'Email address is required.' });

  try {
    const userRes = await db.query('SELECT id, email FROM users WHERE email = $1', [email.trim().toLowerCase()]);

    if (userRes.rows.length === 0) {
      return res.json({ status: 'success', message: 'If an account exists with this email, a reset link has been dispatched.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, userRes.rows[0].id]
    );

    res.json({
      status: 'success',
      message: 'Password reset link dispatched to your email address.',
      resetToken,
    });
  } catch (err) {
    console.error('[Forgot Password Error]', err);
    res.status(500).json({ status: 'error', message: 'Server error processing password reset.' });
  }
});

router.post('/reset-password', authLimiter, async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ status: 'error', message: 'Valid token and minimum 6 character password required.' });
  }

  try {
    const userRes = await db.query(
      'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [token]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Password reset link is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.query(
      'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [passwordHash, userRes.rows[0].id]
    );

    res.json({ status: 'success', message: 'Password has been successfully updated. You may now sign in.' });
  } catch (err) {
    console.error('[Reset Password Error]', err);
    res.status(500).json({ status: 'error', message: 'Server error updating password.' });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const result = await db.query(
      'UPDATE users SET is_email_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING id',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Verification token invalid or already used.' });
    }

    res.json({ status: 'success', message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error verifying email.' });
  }
});

router.delete('/delete-account', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    await db.queryWithRLS(userId, req.user.role, 'DELETE FROM users WHERE id = $1', [userId]);
    res.json({ status: 'success', message: 'Account and associated personal records permanently deleted.' });
  } catch (err) {
    console.error('[Delete Account Error]', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete account.' });
  }
});

module.exports = router;
