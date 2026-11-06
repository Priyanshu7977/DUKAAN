import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Package,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Phone,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { useChatbotStore, ChatMessage } from '../../store/useChatbotStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { PRODUCTS } from '../../data/products';
import { formatPrice, cn } from '../../utils/formatters';

const parseFormattedInline = (content: string) => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-inherit">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const labelMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (labelMatch) {
        parts.push(
          <a
            key={match.index}
            href={labelMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A7654A] underline font-medium hover:opacity-80 transition-opacity"
          >
            {labelMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts;
};

const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    const isShort = !text.includes('\n') && text.trim().length <= 40;
    return (
      <span className={isShort ? 'whitespace-nowrap inline-block' : 'whitespace-pre-wrap break-words'}>
        {text}
      </span>
    );
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        const cleanLine = isBullet
          ? trimmed.replace(/^[•\-*]\s*/, '')
          : isNumbered
          ? trimmed.replace(/^\d+\.\s*/, '')
          : trimmed;

        const rendered = parseFormattedInline(cleanLine);

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-[#A7654A] font-bold text-xs mt-0.5 select-none shrink-0">•</span>
              <span className="flex-1">{rendered}</span>
            </div>
          );
        }

        if (isNumbered) {
          const numMatch = trimmed.match(/^(\d+)\./);
          const num = numMatch ? numMatch[1] : '1';
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-[#A7654A] font-semibold text-[11px] mt-0.5 select-none shrink-0">{num}.</span>
              <span className="flex-1">{rendered}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="my-0.5">
            {rendered}
          </p>
        );
      })}
    </div>
  );
};

export const ChatbotWidget: React.FC = () => {
  const {
    isOpen,
    isTyping,
    unreadCount,
    messages,
    activeSentiment,
    hasInteracted,
    openChat,
    closeChat,
    toggleChat,
    clearHistory,
    sendMessage,
  } = useChatbotStore();

  const user = useAuthStore((state) => state.user);
  const hasStickyBottomBar = useUIStore((state) => state.hasStickyBottomBar);
  const [inputValue, setInputValue] = useState('');
  const [showTooltip, setShowTooltip] = useState(!hasInteracted);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCombinedOrders = () => {
    const list: any[] = [];
    if (user?.orders && Array.isArray(user.orders)) {
      list.push(...user.orders);
    }
    try {
      const stored = localStorage.getItem('dukaan_guest_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) list.push(...parsed);
      }
    } catch {}

    const map = new Map<string, any>();
    list.forEach((o) => {
      if (o && o.id && !map.has(String(o.id).toUpperCase())) {
        map.set(String(o.id).toUpperCase(), o);
      }
    });

    return Array.from(map.values());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    setInputValue('');
    const orders = getCombinedOrders();
    await sendMessage(text, { orders, products: PRODUCTS, activeUser: user });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderCard = (msg: ChatMessage) => {
    if (msg.type === 'order_card' && msg.data) {
      const order = msg.data;
      return (
        <div className="mt-2.5 p-3.5 bg-white border border-[#141414]/10 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#141414]/6">
            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#A7654A]" />
              <span className="text-[11px] font-semibold text-[#141414] tracking-wide">
                {order.id}
              </span>
            </div>
            <span
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                order.status === 'Delivered'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-[#73706B]">
              <span>Estimated Delivery:</span>
              <span className="font-medium text-[#141414]">{order.estimatedDelivery}</span>
            </div>
            <div className="flex items-center justify-between text-[#73706B]">
              <span>Tracking Number:</span>
              <span className="font-mono text-[10px] text-[#141414]">{order.trackingNumber}</span>
            </div>
            <div className="flex items-center justify-between text-[#73706B]">
              <span>Total Value:</span>
              <span className="font-medium text-[#141414]">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.items && order.items[0] && (
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#141414]/6">
              <img
                src={order.items[0].image}
                alt={order.items[0].name}
                className="w-10 h-12 object-cover rounded-xs bg-[#ECE7DD]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#141414] truncate">
                  {order.items[0].name}
                </p>
                <p className="text-[10px] text-[#73706B]">
                  Size: {order.items[0].size} • Qty: {order.items[0].quantity}
                </p>
              </div>
            </div>
          )}

          <Link
            to={`/track/${order.id}`}
            onClick={closeChat}
            className="w-full mt-2 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#141414] hover:text-white text-[#141414] border border-[#141414]/10 text-[10px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Open Dedicated Live Tracker</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      );
    }

    if (msg.type === 'return_card' && msg.data) {
      const data = msg.data;
      return (
        <div className="mt-2.5 p-3.5 bg-white border border-[#141414]/10 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#141414]/6">
            <span className="text-[10px] uppercase tracking-wider text-[#A7654A] font-semibold">
              7-Day Doorstep Guarantee
            </span>
            <span className="text-[10px] font-mono font-medium text-[#141414]">
              {data.returnRef}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-[#73706B]">
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Doorstep courier pickup scheduled at ₹0 charge.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Size exchange or full refund to original bank/UPI.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Simply keep original tags and cloth packaging ready.</span>
            </div>
          </div>

          <Link
            to="/returns"
            onClick={closeChat}
            className="w-full mt-2 py-1.5 rounded-lg bg-[#141414] text-white hover:bg-[#A7654A] text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Return Form</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      );
    }

    if (msg.type === 'product_card' && Array.isArray(msg.data)) {
      return (
        <div className="mt-2.5 grid grid-cols-1 gap-2">
          {msg.data.map((prod: any) => (
            <Link
              key={prod.id}
              to={`/product/${prod.slug}`}
              onClick={closeChat}
              className="flex items-center gap-2.5 p-2 bg-white hover:bg-[#FAF8F5] border border-[#141414]/10 rounded-xl transition-all group"
            >
              <img
                src={prod.image || (prod.images && prod.images[0])}
                alt={prod.name}
                className="w-12 h-14 object-cover rounded-xs bg-[#ECE7DD]"
              />
              <div className="min-w-0 flex-1 pr-1">
                <span className="text-[9px] uppercase tracking-wider text-[#A7654A] font-medium block">
                  {prod.category}
                </span>
                <p className="text-[11px] font-medium text-[#141414] group-hover:text-[#A7654A] transition-colors truncate">
                  {prod.name}
                </p>
                <p className="text-[11px] font-semibold text-[#141414] mt-0.5">
                  {formatPrice(prod.price)}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#73706B] group-hover:text-[#A7654A] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
      );
    }

    if (msg.type === 'ticket_card' && msg.data) {
      const ticket = msg.data;
      return (
        <div className="mt-2.5 p-3.5 bg-white border border-[#A7654A]/30 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#141414]/6">
            <span className="text-[10px] uppercase tracking-wider text-[#A7654A] font-semibold">
              VIP Priority Ticket
            </span>
            <span className="text-[10px] font-mono font-bold text-[#141414]">
              {ticket.ticketId}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <p className="text-[#73706B]">
              Status: <span className="font-semibold text-emerald-700">{ticket.status}</span>
            </p>
            <p className="text-[#73706B]">
              Direct Desk: <span className="font-medium text-[#141414]">{ticket.phone}</span>
            </p>
          </div>

          <a
            href={`https://wa.me/917977641125?text=Hello%20DUKAAN%20Concierge,%20I%20have%20an%20urgent%20inquiry%20regarding%20Ticket%20${ticket.ticketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3 h-3" />
            <span>Connect on WhatsApp Live</span>
          </a>
        </div>
      );
    }

    if (msg.type === 'address_card' && msg.data) {
      const addr = msg.data;
      return (
        <div className="mt-2.5 p-3.5 bg-white border border-[#A7654A]/30 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#141414]/6">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A7654A]" />
              <span className="text-[10px] uppercase tracking-wider text-[#A7654A] font-semibold">
                Address Modification
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#141414]">
              {addr.requestId}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="text-[#73706B]">
              <span className="text-[#141414] font-medium block">Updated Address:</span>
              <p className="mt-0.5 text-[#141414] bg-[#FAF8F5] p-2 rounded-lg border border-[#141414]/6 font-mono text-[11px]">
                {addr.address}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#73706B]">Fulfillment Status:</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                {addr.status}
              </span>
            </div>
          </div>

          <a
            href={`https://wa.me/917977641125?text=Hello%20DUKAAN%20Concierge,%20I%20requested%20an%20address%20modification%20(${addr.requestId})%20for%20delivery%20to:%20${encodeURIComponent(
              addr.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3 h-3" />
            <span>Confirm on WhatsApp Desk</span>
          </a>
        </div>
      );
    }

    return null;
  };

  return (
    <aside
      aria-label="Customer Care Concierge"
      className={cn(
        'fixed right-4 sm:right-6 z-50 select-none transition-all duration-300 ease-out',
        hasStickyBottomBar && !isOpen
          ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)] sm:bottom-6'
          : 'bottom-5 sm:bottom-6'
      )}
    >
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-16 right-0 mb-1 w-64 p-3 bg-[#141414] text-[#FAF9F6] rounded-xl shadow-xl border border-white/10 flex items-start gap-2.5 pointer-events-auto"
          >
            <Sparkles className="w-4 h-4 text-[#A7654A] shrink-0 mt-0.5" />
            <div className="flex-1 pr-1">
              <p className="text-[11px] font-medium leading-tight">
                Need help with sizing or orders?
              </p>
              <p className="text-[10px] text-[#FAF9F6]/70 font-light mt-0.5">
                Dukaan Concierge is online to assist you.
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[#FAF9F6]/50 hover:text-white p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-[380px] md:w-[410px] h-[580px] max-h-[82vh] bg-[#FAF9F6] border border-[#141414]/12 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
          >
            <div className="bg-[#FAF8F5] border-b border-[#141414]/8 px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#141414] text-[#FAF9F6] flex items-center justify-center font-serif text-sm font-semibold shadow-xs">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-sm text-[#141414] font-medium">
                      DUKAAN Concierge
                    </h3>
                    {activeSentiment === 'negative_severe' || activeSentiment === 'negative_moderate' ? (
                      <span className="text-[9px] uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-xs font-semibold">
                        Priority
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#73706B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Now • Instant Assistance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-lg text-[#73706B] hover:text-[#141414] hover:bg-[#FAF9F6] transition-colors"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 rounded-lg text-[#73706B] hover:text-[#141414] hover:bg-[#FAF9F6] transition-colors"
                  aria-label="Close concierge"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth bg-[#FAF9F6]">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isShortUser = isUser && !msg.text.includes('\n') && msg.text.trim().length <= 40;
                const isSingleToken = isUser && msg.text.trim().length <= 3;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {!isUser && (
                        <div className="w-5 h-5 rounded-full bg-[#141414] text-[#FAF9F6] flex items-center justify-center text-[10px] font-serif shrink-0 mb-1 select-none">
                          D
                        </div>
                      )}
                      <div
                        className={`text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                          isUser
                            ? `bg-[#141414] text-[#FAF9F6] rounded-2xl rounded-br-xs max-w-[85%] ${
                                isSingleToken
                                  ? 'px-3.5 py-1.5 min-w-[36px] text-center font-medium inline-block'
                                  : isShortUser
                                  ? 'px-3.5 py-2 whitespace-nowrap inline-flex items-center w-auto'
                                  : 'px-3.5 py-2.5 whitespace-pre-wrap break-words'
                              }`
                            : 'px-3.5 py-2.5 bg-[#FAF8F5] text-[#141414] border border-[#141414]/8 rounded-2xl rounded-bl-xs max-w-[92%]'
                        }`}
                      >
                        <FormattedMessageText text={msg.text} isUser={isUser} />
                        {renderCard(msg)}
                      </div>
                    </div>
                    <span className="text-[9px] text-[#73706B]/70 mt-1 px-1">
                      {msg.timestamp}
                    </span>

                    {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pl-7 max-w-full">
                        {msg.quickReplies.map((reply) => (
                          <button
                            key={reply}
                            onClick={() => handleSend(reply)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#141414] hover:text-[#FAF9F6] text-[#141414] border border-[#141414]/12 text-[10px] font-medium transition-all shadow-3xs active:scale-95"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 pl-7">
                  <div className="bg-[#FAF8F5] border border-[#141414]/8 rounded-full px-3 py-1.5 flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A7654A] animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#A7654A] animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#A7654A] animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="bg-[#FAF8F5] border-t border-[#141414]/8 p-3 shrink-0">
              <div className="bg-white border border-[#141414]/15 rounded-full pl-3.5 pr-1.5 py-1 flex items-center gap-2 focus-within:border-[#141414] transition-all shadow-xs">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about orders, sizes, returns, fabrics..."
                  className="w-full text-xs sm:text-[13px] text-[#141414] placeholder:text-[#73706B]/50 bg-transparent outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="w-7 h-7 rounded-full bg-[#141414] text-white flex items-center justify-center hover:bg-[#A7654A] transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[9px] text-center text-[#73706B]/70 mt-1.5">
                Pure Natural Fabrics • 7-Day Doorstep Returns • 100% Secure
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleChat}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#141414] text-[#FAF9F6] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 border border-white/10 group relative"
        aria-label={isOpen ? 'Close client care chat' : 'Open client care chat'}
      >
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#141414]" />

        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#A7654A] text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}

        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 duration-200" />
        )}
      </button>
    </aside>
  );
};
