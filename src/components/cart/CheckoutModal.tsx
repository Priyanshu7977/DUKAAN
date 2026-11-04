import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { X, CheckCircle, Lock, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { AnimatePresence, motion } from 'framer-motion';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Jammu & Kashmir', 'Ladakh'
];

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, showToast } = useUIStore();
  const { items, getCartTotal, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    paymentMethod: 'upi',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal >= 1999 ? 0 : 150;
  const total = subtotal + shipping;

  // Strict text-only handler: completely blocks any digits
  const handleTextOnlyChange = (field: 'fullName' | 'city', value: string) => {
    const textOnly = value.replace(/[0-9]/g, '');
    setFormData((prev) => ({ ...prev, [field]: textOnly }));
  };

  // Strict number-only handler: completely blocks any letters or symbols
  const handleNumberOnlyChange = (field: 'phone' | 'pincode', value: string, maxLen: number) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, maxLen);
    setFormData((prev) => ({ ...prev, [field]: digitsOnly }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (formData.pincode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrder = `FA-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsSubmitting(false);
      setIsComplete(true);
      clearCart();
      showToast('Order placed successfully!', 'success');
    }, 900);
  };

  const handleClose = () => {
    setIsComplete(false);
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white border border-[#141414]/15 shadow-2xl max-w-2xl w-full my-6 relative overflow-hidden"
        >
          {/* Top Secure Header */}
          <div className="bg-[#141414] text-white text-[10px] uppercase tracking-widest font-medium py-2.5 px-6 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A7654A]" />
              <span>100% Safe & Secure Checkout Across India</span>
            </span>
            <Lock className="w-3 h-3 text-[#A7654A]" />
          </div>

          <div className="p-5 sm:p-7">
            <button
              onClick={handleClose}
              className="absolute top-10 right-5 sm:right-7 text-[#73706B] hover:text-[#141414] transition-colors p-1"
              aria-label="Close checkout modal"
            >
              <X className="w-4 h-4" />
            </button>

            {!isComplete ? (
              <div>
                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#73706B] font-semibold">
                    Delivery Address & Payment
                  </span>
                  <h3 className="font-serif text-2xl text-[#141414] mt-0.5 font-normal">
                    Quick Checkout
                  </h3>
                </div>

                {/* Bill Summary */}
                <div className="mb-5 p-3.5 bg-[#FAF9F6] border border-[#141414]/8 divide-y divide-[#141414]/8 text-xs">
                  <div className="flex justify-between pb-2 text-[#73706B]">
                    <span>Items ({items.length})</span>
                    <span className="font-medium text-[#141414]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-[#73706B]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#A7654A]" />
                      <span>Delivery Charges</span>
                    </span>
                    <span className="font-medium text-[#141414]">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">FREE Delivery</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm text-[#141414] font-medium">
                    <span>Total Amount to Pay</span>
                    <span className="font-serif text-base">{formatPrice(total)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Full Name (Letters only) & Phone (Numbers only) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                        Full Name (Letters only) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleTextOnlyChange('fullName', e.target.value)}
                        placeholder="Enter full name"
                        className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                        Mobile Number (Numbers only) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-2.5 bg-[#EAE7DF] border border-r-0 border-[#141414]/15 text-xs text-[#141414] font-medium tabular-nums">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleNumberOnlyChange('phone', e.target.value, 10)}
                          placeholder="10-digit number"
                          className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      Email Address for Order Updates *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                      Flat / House No., Building, Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter delivery address"
                      className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>

                  {/* City, State & Pincode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                        City (Letters only) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleTextOnlyChange('city', e.target.value)}
                        placeholder="Enter city"
                        className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1 font-medium">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => handleNumberOnlyChange('pincode', e.target.value, 6)}
                        placeholder="6-digit PIN"
                        className="w-full bg-[#FAF9F6] border border-[#141414]/15 px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                      />
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="pt-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73706B] mb-1.5 font-medium">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'upi', label: 'UPI / QR Code (GPay, PhonePe)' },
                        { id: 'cod', label: 'Cash on Delivery (COD)' },
                        { id: 'card', label: 'Debit / Credit Card' },
                        { id: 'netbanking', label: 'Net Banking' },
                      ].map((pm) => (
                        <label
                          key={pm.id}
                          className={`flex items-center gap-2 p-2.5 border cursor-pointer transition-colors ${
                            formData.paymentMethod === pm.id
                              ? 'border-[#141414] bg-[#FAF9F6]'
                              : 'border-[#141414]/10 hover:border-[#141414]/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === pm.id}
                            onChange={() => setFormData({ ...formData, paymentMethod: pm.id })}
                            className="accent-[#141414]"
                          />
                          <span className="text-[11px] font-medium text-[#141414]">{pm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#141414] hover:bg-[#A7654A] text-white text-[11px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Place Order • {formatPrice(total)}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#141414]">Order Placed Successfully!</h3>
                <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Your order is confirmed and will be delivered to:
                </p>
                <div className="p-3 bg-[#FAF9F6] border border-[#141414]/10 text-xs text-[#141414] max-w-sm mx-auto">
                  <p className="text-sm font-bold mb-1 tabular-nums">Order ID: {orderNumber}</p>
                  <p className="font-light">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  <p className="text-[11px] text-[#73706B] mt-1 tabular-nums">Mobile: +91 {formData.phone}</p>
                </div>
                <p className="text-[11px] text-[#73706B] max-w-xs mx-auto">
                  SMS and WhatsApp shipment tracking updates will be sent to +91 {formData.phone}.
                </p>
                <button
                  onClick={handleClose}
                  className="h-11 px-8 inline-flex items-center justify-center bg-[#141414] text-white text-[11px] uppercase tracking-widest font-medium hover:bg-[#A7654A] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
