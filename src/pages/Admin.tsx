import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  MessageSquare,
  Lock,
  ArrowRight,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';
import { UserOrder, Product, ProductSize } from '../types';
import {
  fetchAllOrdersFromFirestore,
  updateOrderStatusInFirestore,
  fetchAllUsersFromFirestore,
  UserProfileDocument
} from '../services/firestoreService';
import { TaxInvoiceModal } from '../components/checkout/TaxInvoiceModal';
import { useUIStore } from '../store/useUIStore';

export const Admin: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const localOrders = user?.orders || [];
  const showToast = useUIStore((state) => state.showToast);

  const isAdminUser = Boolean(
    user?.phone?.includes('7977641125') ||
    user?.email === 'dukaancreate@gmail.com'
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminUser);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'patrons'>('orders');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [usersList, setUsersList] = useState<UserProfileDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('all');
  const [inventoryPage, setInventoryPage] = useState<number>(1);
  const INVENTORY_PAGE_SIZE = 15;
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);

  const [inventoryStockOverrides, setInventoryStockOverrides] = useState<Record<string, string>>({});
  const [openInventoryMenuId, setOpenInventoryMenuId] = useState<string | null>(null);
  const [openOrderMenuId, setOpenOrderMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.status-menu-container')) {
        setOpenInventoryMenuId(null);
        setOpenOrderMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isAdminUser) {
      setIsAuthenticated(true);
    }
  }, [isAdminUser]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      const firestoreOrders = await fetchAllOrdersFromFirestore();
      
      const orderMap = new Map<string, UserOrder>();
      localOrders.forEach((o: UserOrder) => orderMap.set(o.id, o));
      firestoreOrders.forEach((o: UserOrder) => orderMap.set(o.id, o));
      
      const mergedOrders = Array.from(orderMap.values());
      mergedOrders.sort((a: UserOrder, b: UserOrder) => (b.date > a.date ? 1 : -1));
      setOrders(mergedOrders);

      const firestoreUsers = await fetchAllUsersFromFirestore();
      setUsersList(firestoreUsers);
      setIsLoading(false);
    };

    loadData();
  }, [isAuthenticated, localOrders]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1997' || passcode === '7977' || passcode === '0000') {
      setIsAuthenticated(true);
      setPasscodeError('');
      showToast('Admin backoffice unlocked', 'success');
    } else {
      setPasscodeError('Invalid admin master passcode. Contact atelier engineering.');
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
  ) => {
    const updated = await updateOrderStatusInFirestore(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (updated) {
      showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
    } else {
      showToast(`Order status updated locally`, 'info');
    }
  };

  const handleAssignTracking = async (orderId: string) => {
    const defaultAwb = `BD-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const trackingNumber = prompt('Enter Blue Dart / Delhivery AWB number:', defaultAwb);
    if (!trackingNumber) return;

    await updateOrderStatusInFirestore(orderId, 'In Transit', trackingNumber, 'Blue Dart Express');
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'In Transit', trackingNumber }
          : o
      )
    );
    showToast(`Tracking assigned: ${trackingNumber}`, 'success');
  };

  const handleSendWhatsAppDispatch = (order: UserOrder) => {
    const customerPhone = '917977641125';
    const tracking = order.trackingNumber || 'Pending AWB';
    const message = encodeURIComponent(
      `*DUKAAN ATELIER — Dispatch Notice*\n\n` +
      `Valued Patron,\n` +
      `Your bespoke garment order *Order ${order.id}* has been tailored and dispatched via Blue Dart Express.\n\n` +
      `• *AWB Tracking:* ${tracking}\n` +
      `• *Status:* In Transit\n` +
      `• *Order Total:* ₹${order.total.toLocaleString('en-IN')}\n\n` +
      `Track live at: https://dukaan-j5l5.vercel.app/track/${order.id}\n\n` +
      `With warm regards,\nDUKAAN Concierge`
    );
    window.open(`https://api.whatsapp.com/send?phone=${customerPhone}&text=${message}`, '_blank');
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders available to export', 'info');
      return;
    }
    const headers = ['Order ID', 'Date', 'Status', 'Total', 'Payment', 'Tracking', 'Items Count'];
    const rows = orders.map((o) => [
      o.id,
      o.date,
      o.status,
      o.total,
      o.paymentMethod,
      o.trackingNumber || 'None',
      o.items.length,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dukaan_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders CSV exported', 'success');
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const pendingCount = orders.filter((o) => o.status === 'Processing').length;
  const inTransitCount = orders.filter((o) => o.status === 'In Transit').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.items.some((it) => it.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    const matchesStatus = orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = PRODUCTS.filter((p: Product) => {
    const matchesCategory =
      inventoryCategoryFilter === 'all' || p.category.toLowerCase() === inventoryCategoryFilter.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(inventorySearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalInventoryPages = Math.ceil(filteredProducts.length / INVENTORY_PAGE_SIZE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (inventoryPage - 1) * INVENTORY_PAGE_SIZE,
    inventoryPage * INVENTORY_PAGE_SIZE
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#141414]/15 p-8 shadow-xl text-center space-y-5 rounded-sm">
          <div className="w-12 h-12 bg-[#FAF9F6] border border-[#141414]/15 rounded-full flex items-center justify-center mx-auto text-[#141414]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A7654A] font-semibold block">
              Atelier Management
            </span>
            <h1 className="font-serif text-2xl text-[#141414] mt-1 font-normal">
              Merchant Backoffice
            </h1>
            <p className="text-xs text-[#73706B] mt-1 font-light leading-relaxed">
              Enter the authorized administration passcode to access orders, revenue analytics, and atelier inventory.
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-3 pt-2">
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError('');
              }}
              placeholder=""
              maxLength={8}
              className="w-full h-11 px-4 text-center tracking-[0.3em] font-mono text-sm bg-[#FAF9F6] border border-[#141414]/20 focus:outline-none focus:border-[#141414] rounded-sm"
              autoFocus
            />

            {passcodeError && (
              <p className="text-[11px] text-red-600 font-light">{passcodeError}</p>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-[#141414] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all rounded-sm shadow-sm"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-[10px] text-[#73706B]">
            DUKAAN Atelier Apparel Pvt. Ltd. • Encrypted TLS 1.3
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141414] pb-16">
      <header className="bg-white border-b border-[#141414]/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase text-[#141414]">
              DUKAAN
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#FAF9F6] border border-[#141414]/10 text-[#A7654A] rounded-sm">
              Backoffice
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#141414]/20 hover:border-[#141414] bg-white rounded-sm transition-all text-[#141414]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 text-xs text-[#73706B] hover:text-[#141414] transition-colors"
            >
              Lock Terminal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-[#141414]/10 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold flex items-center justify-between">
              <span>Gross Revenue</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            </span>
            <div className="font-serif text-2xl text-[#141414] font-medium pt-1">
              {formatPrice(totalRevenue)}
            </div>
            <span className="text-[10px] text-emerald-800 font-medium block">
              100% Verified Settled Volume
            </span>
          </div>

          <div className="bg-white p-5 border border-[#141414]/10 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold flex items-center justify-between">
              <span>Total Orders</span>
              <Package className="w-3.5 h-3.5 text-[#A7654A]" />
            </span>
            <div className="font-serif text-2xl text-[#141414] font-medium pt-1">
              {orders.length}
            </div>
            <span className="text-[10px] text-[#73706B] block">
              {pendingCount} Pending • {inTransitCount} In Transit
            </span>
          </div>

          <div className="bg-white p-5 border border-[#141414]/10 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold flex items-center justify-between">
              <span>Average Order Value</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            </span>
            <div className="font-serif text-2xl text-[#141414] font-medium pt-1">
              {formatPrice(averageOrderValue)}
            </div>
            <span className="text-[10px] text-[#73706B] block">
              Luxury basket standard
            </span>
          </div>

          <div className="bg-white p-5 border border-[#141414]/10 rounded-sm space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#73706B] font-semibold flex items-center justify-between">
              <span>Atelier Garments</span>
              <Users className="w-3.5 h-3.5 text-[#141414]" />
            </span>
            <div className="font-serif text-2xl text-[#141414] font-medium pt-1">
              {PRODUCTS.length} Designs
            </div>
            <span className="text-[10px] text-emerald-800 font-medium block">
              Active Master Catalog
            </span>
          </div>
        </div>

        <div className="border-b border-[#141414]/10 flex gap-6 text-xs uppercase tracking-wider font-semibold">
          {[
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'inventory', label: `Inventory & Garments (${PRODUCTS.length})` },
            { id: 'patrons', label: `Patrons Directory (${usersList.length || 1})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-[#141414] text-[#141414]'
                  : 'text-[#73706B] hover:text-[#141414]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#73706B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Garment Name..."
                  className="w-full pl-9 pr-3 h-10 text-xs bg-white border border-[#141414]/15 rounded-sm focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#73706B]" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="h-10 px-3 text-xs bg-white border border-[#141414]/15 rounded-sm focus:outline-none focus:border-[#141414]"
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-[#141414]/10 rounded-sm overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#141414]/10 text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Garments Ordered</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status & Logistics</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/8">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#73706B] text-xs">
                        No orders match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-[#141414] block">
                            Order {order.id}
                          </span>
                          <span className="text-[10px] text-[#73706B] block mt-0.5">
                            {order.date}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#141414]/40" />
                                <span className="line-clamp-1 font-medium text-[#141414]">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-[#73706B] shrink-0">
                                  ({item.size}, ×{item.quantity})
                                </span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <span className="text-[10px] text-[#A7654A] font-medium block">
                                +{order.items.length - 2} additional piece(s)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-serif font-medium text-[#141414] tabular-nums">
                          {formatPrice(order.total)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-sm bg-[#FAF9F6] border border-[#141414]/10 text-[#141414]">
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-1.5">
                            <div className="relative inline-block status-menu-container">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenOrderMenuId(openOrderMenuId === order.id ? null : order.id);
                                }}
                                className={`w-[130px] h-8 px-3 text-xs font-semibold rounded-md border flex items-center justify-between cursor-pointer transition-all ${
                                  order.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : order.status === 'In Transit'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : order.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <span className="truncate">{order.status}</span>
                                <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60 ml-1.5" />
                              </button>

                              {openOrderMenuId === order.id && (
                                <div className="absolute left-0 top-full mt-1 w-[135px] bg-white border border-[#141414]/15 rounded-md shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                  {(['Processing', 'In Transit', 'Delivered', 'Cancelled'] as const).map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        handleUpdateStatus(order.id, st);
                                        setOpenOrderMenuId(null);
                                      }}
                                      className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-[#FAF9F6] transition-colors ${
                                        order.status === st ? 'font-semibold text-[#141414] bg-[#ECE7DD]/40' : 'text-[#73706B]'
                                      }`}
                                    >
                                      <span>{st}</span>
                                      {order.status === st && <Check className="w-3 h-3 text-[#141414]" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {order.trackingNumber ? (
                              <div className="flex items-center gap-1 text-[10px] text-[#73706B]">
                                <Truck className="w-3 h-3 text-[#A7654A]" />
                                <span className="font-mono">{order.trackingNumber}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAssignTracking(order.id)}
                                className="text-[10px] text-[#A7654A] underline block hover:text-[#141414] font-medium"
                              >
                                + Assign Tracking AWB
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              title="Print GST Tax Invoice"
                              className="p-1.5 text-[#141414] hover:bg-[#FAF9F6] border border-[#141414]/15 rounded-sm transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSendWhatsAppDispatch(order)}
                              title="Send WhatsApp Dispatch Notice"
                              className="p-1.5 text-[#128C7E] hover:bg-emerald-50 border border-emerald-200 rounded-sm transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={`/track/${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View Customer Tracking Page"
                              className="p-1.5 text-[#73706B] hover:text-[#141414] hover:bg-[#FAF9F6] border border-[#141414]/15 rounded-sm transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#73706B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearchQuery}
                  onChange={(e) => {
                    setInventorySearchQuery(e.target.value);
                    setInventoryPage(1);
                  }}
                  placeholder="Search garments by name, collection, category..."
                  className="w-full pl-9 pr-3 h-10 text-xs bg-white border border-[#141414]/15 rounded-sm focus:outline-none focus:border-[#141414]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All (${PRODUCTS.length})` },
                  { id: 'shirts', label: 'Shirts' },
                  { id: 'trousers', label: 'Trousers' },
                  { id: 'co-ords', label: 'Co-Ords' },
                  { id: 'knitwear', label: 'Knitwear' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setInventoryCategoryFilter(cat.id);
                      setInventoryPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap ${
                      inventoryCategoryFilter === cat.id
                        ? 'bg-[#141414] text-white border-[#141414] shadow-xs'
                        : 'bg-white text-[#73706B] border-[#141414]/15 hover:border-[#141414] hover:text-[#141414]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#141414]/10 rounded-sm overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#141414]/10 text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category & Collection</th>
                    <th className="py-3 px-4">Retail Price</th>
                    <th className="py-3 px-4">Sizes Available</th>
                    <th className="py-3 px-4">Atelier Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141414]/8">
                  {paginatedProducts.map((p: Product) => {
                    const status = inventoryStockOverrides[p.id] || 'In Stock';
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3.5 min-w-[260px]">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-14 object-cover rounded-md bg-[#ECE7DD] border border-[#141414]/10 shrink-0 shadow-2xs"
                            />
                            <div>
                              <span className="font-serif text-sm font-normal text-[#141414] block leading-snug">
                                {p.name}
                              </span>
                              <span className="text-[11px] text-[#73706B] block mt-0.5 font-light">
                                {p.details.composition}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-middle min-w-[160px]">
                          <span className="inline-block px-2 py-0.5 bg-[#FAF9F6] border border-[#141414]/10 uppercase text-[9px] font-semibold text-[#141414] rounded-xs tracking-wider">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-[#73706B] block mt-1">
                            {p.collection}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle font-serif text-sm font-medium text-[#141414] tabular-nums whitespace-nowrap">
                          {formatPrice(p.price)}
                        </td>

                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-1 shrink-0">
                            {p.sizes.map((s: ProductSize) => (
                              <span
                                key={s.size}
                                className={`min-w-6 h-6 px-1.5 text-[10px] font-semibold flex items-center justify-center rounded-xs transition-colors ${
                                  s.inStock
                                    ? 'bg-[#FAF9F6] border border-[#141414]/15 text-[#141414]'
                                    : 'bg-red-50/60 border border-red-200/50 text-red-400 line-through opacity-60'
                                }`}
                              >
                                {s.size}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-middle">
                          <div className="relative inline-block status-menu-container">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenInventoryMenuId(openInventoryMenuId === p.id ? null : p.id);
                              }}
                              className={`w-[136px] h-8 px-3 text-xs font-medium rounded-md border flex items-center justify-between cursor-pointer transition-all ${
                                status === 'In Stock'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/60'
                                  : status === 'Low Batch'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/60'
                                  : 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100/60'
                              }`}
                            >
                              <span className="truncate">{status}</span>
                              <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60 ml-1.5" />
                            </button>

                            {openInventoryMenuId === p.id && (
                              <div className="absolute right-0 top-full mt-1 w-[140px] bg-white border border-[#141414]/15 rounded-md shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                {(['In Stock', 'Low Batch', 'Made to Order'] as const).map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      setInventoryStockOverrides((prev) => ({ ...prev, [p.id]: opt }));
                                      setOpenInventoryMenuId(null);
                                      showToast(`${p.name} set to ${opt}`, 'info');
                                    }}
                                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-[#FAF9F6] transition-colors ${
                                      status === opt ? 'font-semibold text-[#141414] bg-[#ECE7DD]/40' : 'text-[#73706B]'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {status === opt && <Check className="w-3 h-3 text-[#141414]" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-[#73706B] px-1 pt-1">
              <span>
                Showing {(inventoryPage - 1) * INVENTORY_PAGE_SIZE + 1}–{Math.min(inventoryPage * INVENTORY_PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} designs
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={inventoryPage <= 1}
                  onClick={() => setInventoryPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#141414]/15 rounded-md hover:border-[#141414] disabled:opacity-40 disabled:cursor-not-allowed bg-white text-[#141414] font-medium transition-colors"
                >
                  Previous
                </button>
                <span className="tabular-nums font-semibold text-[#141414] px-1">
                  Page {inventoryPage} of {totalInventoryPages}
                </span>
                <button
                  type="button"
                  disabled={inventoryPage >= totalInventoryPages}
                  onClick={() => setInventoryPage((p) => Math.min(totalInventoryPages, p + 1))}
                  className="px-3 py-1.5 border border-[#141414]/15 rounded-md hover:border-[#141414] disabled:opacity-40 disabled:cursor-not-allowed bg-white text-[#141414] font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patrons' && (
          <div className="bg-white border border-[#141414]/10 rounded-sm overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#141414]/10 text-[10px] uppercase tracking-wider text-[#73706B] font-semibold">
                <tr>
                  <th className="py-3 px-4">Patron Name</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Membership Role</th>
                  <th className="py-3 px-4">Orders Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/8">
                <tr className="hover:bg-[#FAF9F6]/50">
                  <td className="py-3.5 px-4 font-medium text-[#141414]">
                    {user?.name || 'Priyanshu Singh'}
                  </td>
                  <td className="py-3.5 px-4 text-[#73706B]">
                    {user?.phone || '+91 7977641125'}<br />
                    {user?.email || 'dukaancreate@gmail.com'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold rounded-sm uppercase tracking-wider">
                      DUKAAN VIP Member
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-serif text-[#141414]">
                    {orders.length} order(s)
                  </td>
                </tr>

                {usersList.map((u) => (
                  <tr key={u.uid} className="hover:bg-[#FAF9F6]/50">
                    <td className="py-3.5 px-4 font-medium text-[#141414]">
                      {u.displayName || 'Patron'}
                    </td>
                    <td className="py-3.5 px-4 text-[#73706B]">
                      {u.phoneNumber || '—'}<br />
                      {u.email || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[#FAF9F6] border border-[#141414]/10 text-[#141414] text-[10px] font-medium rounded-sm uppercase tracking-wider">
                        {u.role || 'Member'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#73706B]">
                      Active Account
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selectedInvoiceOrder && (
        <TaxInvoiceModal
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}
    </div>
  );
};