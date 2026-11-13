import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Truck,
  CheckCircle,
  Package,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CareGoodNoteModal } from '../components/common/CareGoodNoteModal';
import { UserOrder } from '../types';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const user = useAuthStore((state) => state.user);

  const [searchOrderId, setSearchOrderId] = useState(orderId || '');
  const [searchPhone, setSearchPhone] = useState('');
  const [activeOrder, setActiveOrder] = useState<UserOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showGoodNote, setShowGoodNote] = useState(false);

  const getAllKnownOrders = (): UserOrder[] => {
    const list: UserOrder[] = [];
    if (user?.orders) {
      list.push(...user.orders);
    }
    try {
      const stored = localStorage.getItem('dukaan_guest_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          list.push(...parsed);
        }
      }
    } catch {}

    const map = new Map<string, UserOrder>();
    list.forEach((o) => {
      if (o && o.id && !map.has(String(o.id).toUpperCase())) {
        map.set(String(o.id).toUpperCase(), o);
      }
    });

    return Array.from(map.values());
  };

  const locateOrder = (queryId: string) => {
    const cleanId = queryId.trim().toUpperCase();
    if (!cleanId) return null;

    const all = getAllKnownOrders();
    const found = all.find((o) => o.id.toUpperCase() === cleanId || o.id.toUpperCase().includes(cleanId));

    if (found) return found;

    return null;
  };

  useEffect(() => {
    if (orderId) {
      setSearchOrderId(orderId);
      const match = locateOrder(orderId);
      setActiveOrder(match);
      setHasSearched(true);
    } else {
      const all = getAllKnownOrders();
      if (all.length > 0) {
        setActiveOrder(all[0]);
        setSearchOrderId(all[0].id);
      }
    }
  }, [orderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const match = locateOrder(searchOrderId);
    setActiveOrder(match);
  };

  const trackingSteps = [
    {
      title: 'Order Confirmed',
      description: 'Tailoring team received order and verified fabric availability.',
      date: activeOrder?.date || 'Today',
      isCompleted: true,
      isCurrent: activeOrder?.status === 'Processing',
    },
    {
      title: 'Quality & Packaging',
      description: 'Hand-ironed, inspect thread counts, and placed in breathable organic dust bag.',
      date: 'Next Day',
      isCompleted: activeOrder?.status === 'In Transit' || activeOrder?.status === 'Delivered',
      isCurrent: false,
    },
    {
      title: 'Dispatched via Express Air',
      description: `Handed over to ${activeOrder?.trackingNumber?.startsWith('DTDC') ? 'DTDC' : 'BlueDart Express'} (AWB: ${
        activeOrder?.trackingNumber || 'BLUEDART-8891240'
      }).`,
      date: 'In 24h',
      isCompleted: activeOrder?.status === 'In Transit' || activeOrder?.status === 'Delivered',
      isCurrent: activeOrder?.status === 'In Transit',
    },
    {
      title: 'In Transit · Destination Hub',
      description: 'Package routed through regional express logistics terminal.',
      date: 'In Transit',
      isCompleted: activeOrder?.status === 'Delivered',
      isCurrent: false,
    },
    {
      title: 'Out for Doorstep Delivery',
      description: 'Assigned to trusted delivery courier with contactless OTP verification.',
      date: activeOrder?.estimatedDelivery || 'Soon',
      isCompleted: activeOrder?.status === 'Delivered',
      isCurrent: false,
    },
    {
      title: 'Delivered',
      description: 'Successfully handed over to patron.',
      date: activeOrder?.status === 'Delivered' ? activeOrder.estimatedDelivery || 'Delivered' : 'Pending',
      isCompleted: activeOrder?.status === 'Delivered',
      isCurrent: false,
    },
  ];

  return (
    <div className="w-full pb-16 bg-[#FAF9F6]">
      <section className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] border-b border-[#141414]/8 mb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Order Tracking' }]} className="mb-2" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block mb-0.5">
            Real-Time Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#73706B] font-light mt-1 max-w-xl">
            Check live shipment status, courier dispatch milestones, and estimated doorstep delivery across 19,000+ PIN codes.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#141414]/8 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                id="tracking-order-id"
                name="orderId"
                placeholder="Enter Order ID (e.g. DUK-IN-882194 or DUK-88219)"
                className="w-full h-12 pl-10 pr-4 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414]"
              />
              <Search className="w-4 h-4 text-[#73706B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="sm:w-60">
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                id="tracking-phone"
                name="phone"
                placeholder="Mobile (Optional)"
                className="w-full h-12 px-4 bg-[#FAF9F6] border border-[#141414]/15 rounded-xl text-xs font-mono focus:outline-none focus:border-[#141414]"
              />
            </div>

            <button
              type="submit"
              className="h-12 px-8 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-xl transition-all shadow-md active:scale-[0.99] shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {activeOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#141414]/8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#141414]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl text-[#141414] font-medium">
                      Order {activeOrder.id}
                    </h2>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${
                        activeOrder.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : activeOrder.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#73706B] font-light mt-0.5">
                    Placed on {activeOrder.date} • Courier Partner:{' '}
                    <strong className="text-[#141414] font-medium">
                      {activeOrder.trackingNumber || 'BlueDart Air Express'}
                    </strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#73706B] uppercase tracking-wider block">
                    Estimated Delivery
                  </span>
                  <span className="font-serif text-lg font-semibold text-emerald-800">
                    {activeOrder.estimatedDelivery || 'Within 2 to 4 Days'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-base text-[#141414] mb-4">Shipment Milestones</h3>
                <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#141414]/10">
                  {trackingSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          step.isCompleted
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : step.isCurrent
                            ? 'bg-[#141414] border-[#141414] animate-pulse'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {step.isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span
                          className={`text-xs font-semibold ${
                            step.isCompleted || step.isCurrent ? 'text-[#141414]' : 'text-[#73706B]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] text-[#73706B] uppercase tracking-wider">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#73706B] font-light leading-relaxed mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#141414]/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoodNote(true)}
                  className="px-4 py-2.5 bg-[#141414] hover:bg-[#A7654A] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Archival Good Note</span>
                </button>

                <a
                  href={`https://wa.me/917977641125?text=${encodeURIComponent(
                    `Hello DUKAAN, I would like an update on my Order ID: ${activeOrder.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Concierge</span>
                </a>

                <Link
                  to="/returns"
                  className="px-4 py-2.5 bg-[#FAF9F6] border border-[#141414]/15 hover:border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#A7654A]" />
                  <span>Request Size Exchange</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#141414]/8 shadow-sm space-y-4">
                <h3 className="font-serif text-base text-[#141414] pb-2 border-b border-[#141414]/10">
                  Garments in Order ({activeOrder.items.length})
                </h3>
                <div className="divide-y divide-[#141414]/8 space-y-3">
                  {activeOrder.items.map((it) => (
                    <div key={it.id} className="pt-3 flex gap-3 items-center">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-14 h-18 object-cover rounded-lg bg-[#FAF8F5] border border-[#141414]/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-medium text-[#141414] truncate">
                          {it.name}
                        </h4>
                        <p className="text-[11px] text-[#73706B] mt-0.5">
                          Size: <strong className="text-[#141414]">{it.size}</strong> • Qty: {it.quantity}
                        </p>
                        <span className="text-xs font-semibold text-[#141414] block mt-0.5">
                          {formatPrice(it.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#141414]/10 flex justify-between items-baseline text-xs">
                  <span className="text-[#73706B]">Total Paid</span>
                  <span className="font-serif text-base font-semibold text-[#141414]">
                    {formatPrice(activeOrder.total)}
                  </span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#141414]/10 space-y-3 text-xs">
                <h4 className="font-serif text-sm text-[#141414] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>DUKAAN Delivery Promise</span>
                </h4>
                <p className="text-[#73706B] font-light leading-relaxed text-[11px]">
                  All shipments are insured against transit damages. If the size or fit isn't perfect, you are eligible for 100% free doorstep size exchanges within 7 days of receiving the package.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F5] p-12 rounded-2xl border border-[#141414]/8 text-center space-y-3">
            <Package className="w-10 h-10 text-[#73706B] mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-xl text-[#141414]">No Order Located</h3>
            <p className="text-xs text-[#73706B] max-w-sm mx-auto font-light leading-relaxed">
              We couldn't locate an order matching that ID. Check your confirmation WhatsApp/SMS for the order reference (e.g. DUK-IN-XXXXXX).
            </p>
          </div>
        )}
      </div>

      {activeOrder && (
        <CareGoodNoteModal
          isOpen={showGoodNote}
          onClose={() => setShowGoodNote(false)}
          order={{
            orderNumber: activeOrder.id,
            customerName: user?.name || 'Valued Patron',
            customerEmail: user?.email || 'patron@dukaan.in',
            customerPhone: user?.phone || '+91 7977641125',
            shippingAddress: {
              address: 'Registered Patron Address',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
            },
            items: activeOrder.items.map((it) => ({
              name: it.name,
              size: it.size,
              color: it.color,
              price: it.price,
              quantity: it.quantity,
            })),
            subtotal: activeOrder.total,
            discountAmount: 0,
            shippingFee: 0,
            totalAmount: activeOrder.total,
            paymentMethod: activeOrder.paymentMethod,
            createdAt: new Date().toISOString(),
          }}
        />
      )}
    </div>
  );
};
