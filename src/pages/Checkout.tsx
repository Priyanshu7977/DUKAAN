import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatters';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Truck,
  CheckCircle,
  Tag,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Banknote,
  PhoneCall,
  FileText,
  MessageSquare
} from 'lucide-react';
import { ToastContainer } from '../components/common/ToastContainer';
import { isValidIndianPhone, isValidPincode, sanitizeInput } from '../utils/security';
import { AtelierGoodNoteModal } from '../components/common/AtelierGoodNoteModal';
import {
  OrderNotificationPayload,
  dispatchAutomatedOrderNotifications,
  buildWhatsAppOrderLink,
} from '../utils/notificationAutomation';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Jammu & Kashmir', 'Ladakh'
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const showToast = useUIStore((state) => state.showToast);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    addressType: 'Home',
    paymentMethod: 'prepaid',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number; amount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [confirmedNotificationPayload, setConfirmedNotificationPayload] = useState<OrderNotificationPayload | null>(null);
  const [showGoodNoteModal, setShowGoodNoteModal] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<{
    emailDispatched: boolean;
    whatsAppReady: boolean;
    goodNoteUrl: string;
  } | null>(null);

  const subtotal = getCartTotal();
  const shippingFee = subtotal >= 1999 ? 0 : 150;

  const codHandlingFee = formData.paymentMethod === 'cod' ? 99 : 0;

  const discountAmount = appliedDiscount
    ? appliedDiscount.amount
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee + codHandlingFee);

  const handleTextOnly = (field: 'fullName' | 'city', value: string) => {
    const textOnly = value.replace(/[0-9]/g, '');
    setFormData((prev) => ({ ...prev, [field]: textOnly }));
  };

  const handleDigitsOnly = (field: 'phone' | 'pincode', value: string, maxLen: number) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, maxLen);
    setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'WELCOME500' || code === 'DUKAAN500') {
      const amount = Math.min(subtotal, 500);
      const percent = Math.min(100, Math.round((amount / (subtotal || 1)) * 100));
      const discount = { code, percent, amount };
      setAppliedDiscount(discount);
      showToast(`Welcome Coupon "${code}" applied! You saved ₹500`, 'success');
    } else if (code === 'DUKAAN10' || code === 'WELCOME10' || code === 'FIRSTBUY') {
      const amount = Math.round(subtotal * 0.1);
      const discount = { code, percent: 10, amount };
      setAppliedDiscount(discount);
      showToast(`Coupon "${code}" applied! You saved 10%`, 'success');
    } else {
      setCouponError('Invalid coupon code. Try "WELCOME500" or "DUKAAN10"');
      showToast('Invalid coupon code', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponError('');
    showToast('Coupon removed', 'info');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    if (!isValidIndianPhone(formData.phone)) {
      showToast('Please enter a valid 10-digit mobile number (starts with 6, 7, 8, or 9)', 'error');
      return;
    }

    if (!isValidPincode(formData.pincode)) {
      showToast('Please enter a valid 6-digit postal PIN code', 'error');
      return;
    }

    if (!formData.address.trim() || !formData.city.trim()) {
      showToast('Please complete your full delivery address', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `DUK-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderSummary = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items],
        customer: {
          fullName: sanitizeInput(formData.fullName),
          phone: formData.phone.trim(),
          email: sanitizeInput(formData.email),
          address: sanitizeInput(formData.address),
          area: sanitizeInput(formData.area),
          landmark: sanitizeInput(formData.landmark),
          city: sanitizeInput(formData.city),
          state: sanitizeInput(formData.state),
          pincode: formData.pincode.trim(),
          addressType: formData.addressType,
          paymentMethod: formData.paymentMethod,
        },
        subtotal,
        discountAmount,
        shippingFee,
        codHandlingFee,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
      };

      const payload: OrderNotificationPayload = {
        orderNumber: orderId,
        customerName: sanitizeInput(formData.fullName),
        customerEmail: sanitizeInput(formData.email) || 'client@dukaan.in',
        customerPhone: formData.phone.trim(),
        shippingAddress: {
          address: sanitizeInput(formData.address),
          area: sanitizeInput(formData.area),
          city: sanitizeInput(formData.city),
          state: sanitizeInput(formData.state),
          pincode: formData.pincode.trim(),
        },
        items: items.map((it) => ({
          name: it.product.name,
          size: it.selectedSize,
          color: it.selectedColor,
          price: it.product.price,
          quantity: it.quantity,
        })),
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        createdAt: new Date().toISOString(),
      };

      setConfirmedNotificationPayload(payload);
      setConfirmedOrder(orderSummary);
      setIsComplete(true);
      setIsSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Order confirmed successfully!', 'success');

      dispatchAutomatedOrderNotifications(payload).then((res) => {
        setNotificationStatus(res);
      });
    }, 1100);
  };

  if (items.length === 0 && !isComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-[#FAF9F6]">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 border border-[#141414]/10">
          <div className="w-14 h-14 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto text-[#141414]">
            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl text-[#141414]">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-[#73706B] font-light leading-relaxed">
            You don't have any garments in your bag. Add pieces from our collection before proceeding to checkout.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block px-7 py-3 bg-[#141414] hover:bg-[#A7654A] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              Explore Clothes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 border border-[#141414]/10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
              <CheckCircle className="w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-semibold block">
              Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal">
              Thank You, {confirmedOrder.customer.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#73706B] max-w-md mx-auto font-light leading-relaxed">
              Your order has been received and is being prepared for dispatch. Live tracking updates will be sent to your WhatsApp & Email.
            </p>

            <div className="pt-2 inline-flex items-center gap-3 px-4 py-2 bg-[#FAF9F6] border border-[#141414]/10 font-medium tabular-nums text-xs">
              <span className="text-[#73706B]">Order ID:</span>
              <span className="font-bold text-[#141414]">{confirmedOrder.orderId}</span>
              <span className="text-[#73706B]">•</span>
              <span className="text-[#73706B]">{confirmedOrder.date}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold rounded-full shadow-2xs">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>Email Confirmation Dispatched</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold rounded-full shadow-2xs">
                <MessageSquare className="w-3 h-3 text-[#128C7E]" />
                <span>WhatsApp Notification Ready</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-semibold rounded-full shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#A7654A]" />
                <span>Atelier Good Note Generated</span>
              </span>
            </div>

            {confirmedNotificationPayload && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-xl mx-auto">
                <button
                  type="button"
                  onClick={() => setShowGoodNoteModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#141414] hover:bg-[#A7654A] text-white text-xs font-semibold uppercase tracking-wider transition-all rounded-sm shadow-sm active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Archival Good Note</span>
                </button>

                <a
                  href={buildWhatsAppOrderLink(confirmedNotificationPayload)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider transition-all rounded-sm shadow-sm active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Open WhatsApp Receipt</span>
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-5 border border-[#141414]/10 space-y-3 text-xs">
              <h3 className="font-serif text-base text-[#141414] pb-2 border-b border-[#141414]/8">
                Delivery Address
              </h3>
              <div className="space-y-1 text-[#141414]">
                <p className="font-medium">{confirmedOrder.customer.fullName}</p>
                <p className="text-[#73706B] font-light">
                  {confirmedOrder.customer.address}
                  {confirmedOrder.customer.area && `, ${confirmedOrder.customer.area}`}
                  {confirmedOrder.customer.landmark && `, Near ${confirmedOrder.customer.landmark}`}
                </p>
                <p className="text-[#73706B] font-light">
                  {confirmedOrder.customer.city}, {confirmedOrder.customer.state} — {confirmedOrder.customer.pincode}
                </p>
                <p className="pt-1 font-medium text-[#141414] tabular-nums">
                  Mobile: +91 {confirmedOrder.customer.phone}
                </p>
                <p className="text-[#73706B]">Email: {confirmedOrder.customer.email}</p>
              </div>

              <div className="pt-2 border-t border-[#141414]/8 text-[11px] text-[#73706B] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>Estimated Delivery: Within 2 – 4 working days</span>
              </div>
            </div>

            <div className="bg-white p-5 border border-[#141414]/10 space-y-3 text-xs">
              <h3 className="font-serif text-base text-[#141414] pb-2 border-b border-[#141414]/8">
                Payment Summary
              </h3>
              <div className="space-y-1.5 text-[#73706B]">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-[#141414]">
                    {confirmedOrder.paymentMethod === 'cod' ? (
                      <span className="text-amber-800 font-semibold">Cash on Delivery (COD)</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Prepaid Online (UPI / Card)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#141414]">{formatPrice(confirmedOrder.subtotal)}</span>
                </div>
                {confirmedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatPrice(confirmedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span className="font-medium text-[#141414]">
                    {confirmedOrder.shippingFee === 0 ? 'FREE' : formatPrice(confirmedOrder.shippingFee)}
                  </span>
                </div>
                {confirmedOrder.codHandlingFee > 0 && (
                  <div className="flex justify-between text-amber-900">
                    <span>COD Handling Charge:</span>
                    <span>+{formatPrice(confirmedOrder.codHandlingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#141414]/8 text-sm font-medium text-[#141414]">
                  <span>Total Amount {confirmedOrder.paymentMethod === 'cod' ? 'Payable at Doorstep' : 'Paid'}:</span>
                  <span className="font-serif text-base">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {confirmedOrder.paymentMethod === 'cod' && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  💡 Please keep <strong>{formatPrice(confirmedOrder.total)}</strong> ready in cash or UPI QR code for the delivery agent.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <a
              href="https://wa.me/917977641125"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-emerald-800 underline font-medium hover:text-emerald-900"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Questions? WhatsApp Customer Care at +91 7977641125</span>
            </a>

            <button
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-8 py-3 bg-[#141414] hover:bg-[#A7654A] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {confirmedNotificationPayload && (
            <AtelierGoodNoteModal
              isOpen={showGoodNoteModal}
              onClose={() => setShowGoodNoteModal(false)}
              order={confirmedNotificationPayload}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-16">
      <header className="bg-white border-b border-[#141414]/8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs text-[#73706B] hover:text-[#141414] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Shopping</span>
          </Link>

          <Link to="/" className="font-serif text-lg sm:text-2xl tracking-[0.28em] uppercase text-[#141414] font-medium">
            DUKAAN
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] text-[#73706B] font-medium">
            <Lock className="w-3.5 h-3.5 text-[#A7654A]" />
            <span className="hidden sm:inline">100% Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-5 sm:p-6 border border-[#141414]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#141414]/8">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <h2 className="font-serif text-lg text-[#141414]">Contact Information</h2>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#73706B]">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                    Mobile Number (10 digits) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-[#EAE7DF] border border-r-0 border-[#141414]/15 text-xs text-[#141414] font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleDigitsOnly('phone', e.target.value, 10)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <span className="text-[10px] text-[#73706B] mt-1 block">For order updates & delivery coordination</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                  <span className="text-[10px] text-[#73706B] mt-1 block">Order invoice & tracking link will be sent here</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 border border-[#141414]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#141414]/8">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <h2 className="font-serif text-lg text-[#141414]">Delivery Address</h2>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#73706B]">All India</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                    Full Name (Letters only) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleTextOnly('fullName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                    Flat / House No., Building Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House / Flat no, Building name"
                    className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      Road Name, Area, Colony *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Street, Sector, Area"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Near temple, metro station, etc."
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => handleDigitsOnly('pincode', e.target.value, 6)}
                      placeholder="6-digit PIN"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      City (Letters only) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleTextOnly('city', e.target.value)}
                      placeholder="Enter city"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#73706B] mb-1.5 font-medium">
                    Address Type
                  </label>
                  <div className="flex gap-2">
                    {['Home', 'Work / Office'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, addressType: type })}
                        className={`px-3.5 py-1.5 text-xs border transition-colors ${
                          formData.addressType === type
                            ? 'bg-[#141414] text-white border-[#141414] font-medium'
                            : 'bg-white text-[#73706B] border-[#141414]/15 hover:text-[#141414]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 border border-[#141414]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#141414]/8">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  <h2 className="font-serif text-lg text-[#141414]">Select Payment Method</h2>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#73706B]">Safe & Verified</span>
              </div>

              <div className="space-y-3">
                <label
                  className={`block p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'prepaid'
                      ? 'border-[#141414] bg-[#FAF9F6] shadow-sm'
                      : 'border-[#141414]/15 hover:border-[#141414]/40 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="prepaid"
                        checked={formData.paymentMethod === 'prepaid'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'prepaid' })}
                        className="accent-[#141414] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm text-[#141414]">
                            UPI / Online Payment (Google Pay, PhonePe, Cards, NetBanking)
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 uppercase tracking-wider">
                            Save ₹99
                          </span>
                        </div>
                        <p className="text-xs text-[#73706B] font-light mt-0.5">
                          Instant contactless payment. Zero convenience fees and fastest dispatch.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-[#141414] hidden sm:block shrink-0 mt-1" />
                  </div>
                </label>

                <label
                  className={`block p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#141414] bg-[#FAF9F6] shadow-sm'
                      : 'border-[#141414]/15 hover:border-[#141414]/40 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="accent-[#141414] w-4 h-4 mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm text-[#141414]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 uppercase tracking-wider">
                            +₹99 Handling Fee
                          </span>
                        </div>
                        <p className="text-xs text-[#73706B] font-light mt-0.5">
                          Pay with cash or UPI QR code at your doorstep upon parcel arrival.
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-[#A7654A] hidden sm:block shrink-0 mt-1" />
                  </div>

                  {formData.paymentMethod === 'cod' && (
                    <div className="mt-3 pt-2.5 border-t border-[#141414]/8 flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed bg-amber-50/70 p-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                      <span>
                        <strong>Standard COD Rule:</strong> A handling fee of ₹99 applies to Cash on Delivery orders to cover courier cash-collection and verification formalities. Select online payment above to enjoy <strong>₹0 handling fee</strong>.
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 active:scale-[0.99] rounded-sm"
              >
                {isSubmitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <span>
                    Place Order • {formatPrice(finalTotal)}
                  </span>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#73706B] mt-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>By placing this order, you agree to our 7-Day Easy Return Policy</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 border border-[#141414]/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#141414]/8">
                <h3 className="font-serif text-base text-[#141414]">Order Review</h3>
                <span className="text-xs text-[#73706B]">
                  {items.length} {items.length === 1 ? 'Garment' : 'Garments'}
                </span>
              </div>

              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 divide-y divide-[#141414]/8">
                {items.map((item) => (
                  <div key={item.id} className="pt-3.5 first:pt-0 flex gap-3">
                    <div className="w-16 h-20 bg-[#ECE7DD] shrink-0 overflow-hidden relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-[#141414] text-white text-[9px] px-1.5 py-0.5 font-medium tabular-nums">
                        ×{item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-serif text-[#141414] font-normal leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#73706B]">
                          <span>Size: <strong className="text-[#141414] font-medium">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span>Color: <strong className="text-[#141414] font-medium">{item.selectedColor}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#73706B]">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-serif text-sm text-[#141414] font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 border border-[#141414]/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-[#141414] font-medium">
                <Tag className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>Apply Promo / Coupon Code</span>
              </div>

              {!appliedDiscount ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. DUKAAN10)"
                    className="flex-1 bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs uppercase tracking-wider text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#141414] hover:bg-[#A7654A] text-white text-[11px] uppercase tracking-widest font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.percent}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-600 underline font-medium hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-light">{couponError}</p>
              )}
            </div>

            <div className="bg-white p-5 border border-[#141414]/10 space-y-3 text-xs">
              <h3 className="font-serif text-base text-[#141414] pb-2 border-b border-[#141414]/8">
                Bill Summary
              </h3>

              <div className="space-y-2 text-[#73706B]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#141414]">{formatPrice(subtotal)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount ({appliedDiscount.percent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-[#141414]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE Delivery</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Cash on Delivery Handling Charge</span>
                  <span>
                    {formData.paymentMethod === 'cod' ? (
                      <strong className="text-amber-900 font-medium">+{formatPrice(codHandlingFee)}</strong>
                    ) : (
                      <span className="text-emerald-700 font-medium">₹0 (Prepaid Free)</span>
                    )}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#141414]/8 flex justify-between items-baseline text-sm font-medium text-[#141414]">
                  <div>
                    <span className="text-base font-serif">Total Amount</span>
                    <p className="text-[10px] text-[#73706B] font-light">Includes all GST & local taxes</p>
                  </div>
                  <span className="font-serif text-lg text-[#141414] font-semibold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-4 border border-[#141414]/10 space-y-2.5 text-xs text-[#73706B]">
              <div className="flex items-center gap-2 text-[#141414] font-medium text-[11px]">
                <RotateCcw className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>7-Day Easy Doorstep Size Exchanges</span>
              </div>
              <div className="flex items-center gap-2 text-[#141414] font-medium text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>100% Pure Natural European Linen & Cotton</span>
              </div>
              <div className="flex items-center gap-2 text-[#141414] font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A]" />
                <span>Safe Delivery to 19,000+ PIN Codes Across India</span>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
