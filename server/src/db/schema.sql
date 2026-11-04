-- ==============================================================================
-- DUKAAN Luxury E-Commerce Database Schema
-- Production PostgreSQL with Row Level Security (RLS), Triggers & Strict Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP WITH TIME ZONE,
    otp_code VARCHAR(10),
    otp_expires TIMESTAMP WITH TIME ZONE,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' | 'admin' | 'staff'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street TEXT NOT NULL,
    apartment TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table (Master Authoritative Price Catalog)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    price INTEGER NOT NULL CHECK (price >= 0), -- Authoritative currency in INR
    category VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    description TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal INTEGER NOT NULL,
    discount_amount INTEGER DEFAULT 0,
    shipping_fee INTEGER DEFAULT 0,
    total_amount INTEGER NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- 'prepaid' | 'cod'
    payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'refunded'
    order_status VARCHAR(30) DEFAULT 'confirmed', -- 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can ONLY view and modify their own data at the database engine level
-- ==============================================================================

-- Enable RLS on Sensitive Tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- App User Context Setting: current_setting('app.current_user_id', true)
-- 1. Users can only select/update their own profile
CREATE POLICY user_read_own_profile ON users
    FOR SELECT
    USING (id::text = current_setting('app.current_user_id', true) OR current_setting('app.current_role', true) = 'admin');

CREATE POLICY user_update_own_profile ON users
    FOR UPDATE
    USING (id::text = current_setting('app.current_user_id', true));

CREATE POLICY user_delete_own_profile ON users
    FOR DELETE
    USING (id::text = current_setting('app.current_user_id', true));

-- 2. Addresses RLS
CREATE POLICY address_read_own ON user_addresses
    FOR SELECT
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY address_write_own ON user_addresses
    FOR ALL
    USING (user_id::text = current_setting('app.current_user_id', true));

-- 3. Orders RLS
CREATE POLICY orders_read_own ON orders
    FOR SELECT
    USING (user_id::text = current_setting('app.current_user_id', true) OR current_setting('app.current_role', true) = 'admin');

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
