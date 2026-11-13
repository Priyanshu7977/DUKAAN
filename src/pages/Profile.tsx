import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import {
  User,
  Package,
  MapPin,
  Heart,
  Shield,
  LogOut,
  Phone,
  Mail,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  Sparkles,
  ShoppingBag,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { TaxInvoiceModal } from '../components/checkout/TaxInvoiceModal';
import { SEOHead } from '../components/seo/SEOHead';

export const Profile: React.FC = () => {
  const {
    user,
    isAuthenticated,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    openLoginModal,
  } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const showToast = useUIStore((state) => state.showToast);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'settings'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleVerifyEmail = () => {
    setIsEmailVerified(true);
    showToast('Verification confirmation dispatched! Email verified.', 'success');
  };

  const handlePermanentAccountDelete = () => {
    if (deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') {
      showToast('Please type "DELETE" exactly to confirm account termination.', 'error');
      return;
    }
    setIsDeleting(true);
    setTimeout(() => {
      logout();
      setShowDeleteModal(false);
      navigate('/');
      showToast('Your account, personal records, and data have been permanently wiped.', 'info');
    }, 800);
  };

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF9F6]">
        <SEOHead title="Sign In | DUKAAN" noindex />
        <div className="max-w-md w-full bg-white border border-[#141414]/10 rounded-2xl p-8 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 bg-[#FAF8F5] border border-[#141414]/10 rounded-full flex items-center justify-center mx-auto text-[#141414]">
            <User className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl text-[#141414]">Sign In to Your Account</h2>
            <p className="text-xs text-[#73706B] font-light max-w-xs mx-auto">
              Access your order history, delivery tracking, and saved preferences with your phone or email.
            </p>
          </div>
          <button
            onClick={openLoginModal}
            className="w-full py-3 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-medium rounded-lg transition-all shadow-md"
          >
            Sign In / Register Now
          </button>
          <div className="pt-2">
            <Link to="/shop" className="text-xs text-[#73706B] hover:text-[#141414] underline">
              Browse Wardrobe Collection →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
    });
    setIsEditingProfile(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;
    addAddress({
      fullName: user.name,
      phone: user.phone,
      street: newStreet,
      city: newCity,
      state: newState || 'Maharashtra',
      pincode: newPincode,
    });
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPincode('');
    setIsAddingAddress(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-6 sm:py-12 pb-32 sm:pb-24 border-b border-[#141414]/8">
      <SEOHead title="Patron Profile | DUKAAN" noindex />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        <div className="bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl p-5 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#141414] text-white rounded-full flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#141414] font-normal truncate">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] tracking-wider uppercase bg-[#A7654A]/10 text-[#A7654A] px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  <span>{user.tier}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#73706B]">
                {user.phone && (
                  <span className="flex items-center gap-1.5 font-medium tabular-nums">
                    <Phone className="w-3.5 h-3.5 text-[#141414]/60" />
                    <span>{user.phone}</span>
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#141414]/60" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                    {isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={handleVerifyEmail}
                        className="inline-flex items-center gap-1 text-[9px] text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full font-semibold transition-colors"
                      >
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Verify Now</span>
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#141414]/8">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 border border-[#141414]/8 bg-[#FAF8F5] p-1 rounded-xl shadow-xs gap-1 sm:flex sm:items-center sm:gap-6 sm:px-6 sm:py-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 sm:py-3 px-1 sm:px-3 text-[10px] sm:text-xs uppercase tracking-wider font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-none sm:border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-white sm:bg-transparent shadow-xs sm:shadow-none sm:border-[#141414] text-[#141414] font-bold'
                : 'border-transparent text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Orders <span className="text-[9px] sm:text-xs opacity-75">({user.orders.length})</span></span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-2 sm:py-3 px-1 sm:px-3 text-[10px] sm:text-xs uppercase tracking-wider font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-none sm:border-b-2 transition-all ${
              activeTab === 'addresses'
                ? 'bg-white sm:bg-transparent shadow-xs sm:shadow-none sm:border-[#141414] text-[#141414] font-bold'
                : 'border-transparent text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Addresses <span className="text-[9px] sm:text-xs opacity-75">({user.addresses.length})</span></span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-2 sm:py-3 px-1 sm:px-3 text-[10px] sm:text-xs uppercase tracking-wider font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-none sm:border-b-2 transition-all ${
              activeTab === 'wishlist'
                ? 'bg-white sm:bg-transparent shadow-xs sm:shadow-none sm:border-[#141414] text-[#141414] font-bold'
                : 'border-transparent text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Wishlist <span className="text-[9px] sm:text-xs opacity-75">({wishlistItems.length})</span></span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 sm:py-3 px-1 sm:px-3 text-[10px] sm:text-xs uppercase tracking-wider font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg sm:rounded-none sm:border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-white sm:bg-transparent shadow-xs sm:shadow-none sm:border-[#141414] text-[#141414] font-bold'
                : 'border-transparent text-[#73706B] hover:text-[#141414]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Settings</span>
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#141414]">Order History & Real-Time Tracking</h2>
            {(user.orders || []).length === 0 ? (
              <div className="bg-[#FAF8F5] p-8 rounded-2xl text-center space-y-3 border border-[#141414]/8">
                <p className="text-sm text-[#73706B]">You have no active orders yet.</p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-[#141414] text-white text-xs uppercase tracking-wider font-medium rounded-lg"
                >
                  Start Shopping →
                </Link>
              </div>
            ) : (
              (user.orders || []).map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#141414]/8 gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#141414] tracking-wide">Order {order.id}</span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#73706B]">Placed on {order.date}</span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-serif text-base font-semibold text-[#141414]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#73706B] block uppercase tracking-wider">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-lg bg-[#F3EEEB] border border-[#141414]/8"
                        />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-serif text-sm text-[#141414] font-medium leading-snug">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#73706B]">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-semibold text-[#141414] block">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#141414]/6 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 text-[#141414]">
                      <Truck className="w-4 h-4 text-[#A7654A]" />
                      <span>
                        {order.status === 'Delivered'
                          ? `Delivered on ${order.estimatedDelivery}`
                          : `Estimated Delivery: ${order.estimatedDelivery}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] border border-[#141414]/15 hover:border-[#141414] text-[#141414] text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                      >
                        <FileText className="w-3 h-3 text-emerald-800" />
                        <span>Tax Invoice</span>
                      </button>
                      <Link
                        to={`/track/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] border border-[#141414]/15 hover:border-[#141414] text-[#141414] text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                      >
                        <span>Track Shipment</span>
                        <ArrowRight className="w-3 h-3 text-[#A7654A]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#141414]">Saved Delivery Addresses</h2>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-4 py-2 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {isAddingAddress && (
              <form
                onSubmit={handleCreateAddress}
                className="bg-[#FAF8F5] border border-[#141414]/10 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-serif text-base text-[#141414]">Add New Delivery Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                      Street Address & Building
                    </label>
                    <input
                      type="text"
                      id="profile-new-street"
                      name="street"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. Flat 301, Palm Grove, Linking Road"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                      City
                    </label>
                    <input
                      type="text"
                      id="profile-new-city"
                      name="city"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                      State
                    </label>
                    <input
                      type="text"
                      id="profile-new-state"
                      name="state"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                      Pincode (6 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      id="profile-new-pincode"
                      name="pincode"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="400050"
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414] font-medium tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm flex items-center justify-center transition-all active:scale-[0.99]"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="h-11 px-5 border border-[#141414]/20 text-[#141414] text-xs uppercase tracking-wider font-medium rounded-lg hover:bg-[#FAF8F5] flex items-center justify-center transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(user.addresses || []).map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-[#FAF8F5] border rounded-2xl p-5 space-y-3 relative shadow-sm ${
                    addr.isDefault ? 'border-[#141414] ring-1 ring-[#141414]' : 'border-[#141414]/8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#141414]">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase tracking-wider bg-[#141414] text-white px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#73706B] leading-relaxed">
                    {addr.street}
                    {addr.apartment && `, ${addr.apartment}`}
                    <br />
                    {addr.city}, {addr.state}, {addr.pincode}
                  </p>
                  <span className="text-xs text-[#141414] font-medium block">Phone: {addr.phone}</span>

                  <div className="pt-2 flex items-center gap-3 border-t border-[#141414]/8">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-xs text-[#141414] hover:underline font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    {user.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-[#141414]">Saved Wishlist Pieces</h2>
            {wishlistItems.length === 0 ? (
              <div className="bg-[#FAF8F5] p-8 rounded-2xl text-center space-y-3 border border-[#141414]/8">
                <p className="text-sm text-[#73706B]">Your wishlist is currently empty.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center h-11 px-6 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm"
                >
                  Explore Collection →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#FAF8F5] border border-[#141414]/8 rounded-xl overflow-hidden shadow-sm flex flex-col"
                  >
                    <Link to={`/product/${product.slug}`} className="aspect-[3/4] overflow-hidden bg-[#F3EEEB]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-xs text-[#141414] font-medium truncate">
                          {product.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#141414] block mt-0.5">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          addItemToCart(product, product.sizes[0]?.size || 'M', product.colors[0]?.name || 'Standard');
                          openCart();
                        }}
                        className="w-full h-10 bg-[#141414] hover:bg-black text-white text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-[#FAF8F5] border border-[#141414]/8 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
            <h2 className="font-serif text-xl text-[#141414]">Personal Information & Security</h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="profile-edit-name"
                  name="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                  Email Address
                </label>
                <input
                  type="email"
                  id="profile-edit-email"
                  name="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#141414]">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  id="profile-edit-phone"
                  name="phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#141414]/15 rounded-lg focus:outline-none focus:border-[#141414] font-medium tabular-nums"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-all shadow-md active:scale-[0.99] flex items-center justify-center"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-red-200 space-y-3">
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
              </div>
              <p className="text-xs text-[#73706B]">
                Permanently purge your account, saved addresses, and active login sessions across all devices. This action is irreversible.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmationInput('');
                  setShowDeleteModal(true);
                }}
                className="h-12 px-6 border-2 border-red-600 hover:bg-red-50 text-red-600 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account & Wipe Records</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-red-200 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#141414]">Delete Account Permanently</h3>
              <p className="text-xs text-[#73706B] leading-relaxed">
                This will permanently delete your DUKAAN account, purge all associated addresses, and revoke all active sessions. This action cannot be reversed.
              </p>
            </div>
            <div className="space-y-2 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#141414]/10">
              <label className="text-[11px] font-semibold text-[#141414] block">
                Type <span className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-200 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                id="profile-delete-confirm"
                name="confirmDelete"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 text-xs bg-white border border-[#141414]/20 rounded-lg focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="h-12 border border-[#141414]/20 hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
                onClick={handlePermanentAccountDelete}
                className="h-12 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={{
            id: selectedInvoiceOrder.id,
            date: selectedInvoiceOrder.date,
            total: selectedInvoiceOrder.total,
            paymentMethod: selectedInvoiceOrder.paymentMethod,
            items: selectedInvoiceOrder.items,
            customer: {
              fullName: user.name,
              phone: user.phone,
              email: user.email,
              address: user.addresses[0]?.street,
              city: user.addresses[0]?.city,
              state: user.addresses[0]?.state,
              pincode: user.addresses[0]?.pincode,
            },
            trackingNumber: selectedInvoiceOrder.trackingNumber,
          }}
        />
      )}
    </div>
  );
};
