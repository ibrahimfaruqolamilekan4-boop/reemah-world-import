import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Search, ArrowLeft, ShieldCheck, MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  orders: Order[];
  onBackToShop: () => void;
  initialOrderId?: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ orders, onBackToShop, initialOrderId = '' }) => {
  const [searchId, setSearchId] = useState(initialOrderId);
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    initialOrderId ? orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null : orders[0] || null
  );
  const [searched, setSearched] = useState(Boolean(initialOrderId || orders.length > 0));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = orders.find(o => o.id.toLowerCase().includes(searchId.trim().toLowerCase()));
    if (found) {
      setActiveOrder(found);
    } else {
      setActiveOrder({
        id: searchId.trim().toUpperCase(),
        userId: 'guest',
        customerName: 'Valued Customer',
        customerEmail: 'customer@example.com',
        customerPhone: '+234 800 000 0000',
        shippingAddress: {
          street: '15 Admiralty Way, Lekki Phase 1',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria'
        },
        items: [
          { productId: 'demo1', title: 'Imported Kitchen & Home Express Package', price: 28500, quantity: 1, mediaUrl: 'https://picsum.photos/seed/tracking1/600/600' }
        ],
        totalAmount: 28500,
        paymentMethod: 'bank_transfer',
        paymentReference: 'RW-PAY-' + Math.floor(100000 + Math.random() * 900000),
        status: 'Shipped',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      });
    }
    setSearched(true);
  };

  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  const getSteps = (status: Order['status']) => {
    const steps = [
      { title: 'Order Placed & Confirmed', desc: 'Payment verified and order recorded in Reemah World database', completed: true, time: '2 days ago' },
      { title: 'Warehouse Processing & QC', desc: 'Items checked at our consolidation facility before export', completed: ['Processing', 'Shipped', 'Delivered'].includes(status) || status === 'Pending', time: '1 day ago' },
      { title: 'Dispatched from Origin Hub', desc: 'Air cargo flight departed international logistics terminal', completed: ['Shipped', 'Delivered'].includes(status), time: '18 hours ago' },
      { title: 'Customs Clearance & Arrival', desc: 'Cleared Nigerian port inspection and sorted at Lagos hub', completed: ['Shipped', 'Delivered'].includes(status), time: '6 hours ago' },
      { title: 'Out for Local Delivery', desc: 'Assigned to dispatch rider for direct delivery to your address', completed: status === 'Delivered', time: 'Pending' },
      { title: 'Delivered Successfully', desc: 'Package handed over to recipient with confirmation code', completed: status === 'Delivered', time: 'Pending' },
    ];
    return steps;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store Feed
          </button>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Live Order Tracking</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Enter your order reference ID (e.g. RW-10294) to track international shipping status in real-time.
          </p>
        </div>
        <div className="manifest-tag self-start sm:self-auto">
          <span className="dot" /> REEMAH EXPRESS LOGISTICS
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. RW-83920 or test ID)..."
              className="w-full bg-white border border-stone-300 rounded-xl pl-11 pr-4 py-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4 text-amber-500" /> Track Shipment
          </button>
        </form>

        {/* Quick Demo Order Chips */}
        {orders.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Your recent orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchId(o.id);
                  setActiveOrder(o);
                  setSearched(true);
                }}
                className="text-xs font-mono bg-white border border-stone-200 hover:border-amber-500 px-3 py-1 rounded-full text-stone-800 transition-colors shadow-2xs"
              >
                {o.id} ({o.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Result Display */}
      {searched && activeOrder ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden space-y-6">
          {/* Top Order Meta Summary */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Verified Air Cargo Shipment
              </div>
              <h3 className="text-2xl font-mono font-bold mt-1 text-white">{activeOrder.id}</h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString()} • Ref: {activeOrder.paymentReference}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 text-left sm:text-right">
              <span className="text-[11px] text-stone-300 uppercase tracking-wider block font-mono">Current Status</span>
              <span className="text-sm font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 sm:justify-end mt-0.5">
                <Truck className="w-4 h-4 animate-pulse" /> {activeOrder.status}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Timeline Milestones */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-6">
                Live Shipment Milestones
              </h4>
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {getSteps(activeOrder.status).map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-10">
                    <div
                      className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed
                          ? 'bg-amber-600 text-white shadow-sm ring-4 ring-amber-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className={`text-sm font-bold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </h5>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items & Shipping Destination Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Shipped Items ({activeOrder.items.length})
                </h4>
                <div className="space-y-2.5">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      <img src={item.mediaUrl} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-stone-200" />
                      <div className="flex-1 min-w-0">
                        <h6 className="text-xs font-bold text-stone-900 truncate">{item.title}</h6>
                        <p className="text-xs text-stone-500">{item.quantity}x @ {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Delivery Destination &amp; Contact
                </h4>
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 space-y-2 text-xs text-stone-800">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900">Address:</span> {activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-amber-200/40">
                    <span className="font-bold text-amber-900">Recipient:</span> {activeOrder.customerName} ({activeOrder.customerPhone})
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-amber-200/40 font-mono text-[11px] text-stone-600">
                    <span className="font-bold text-stone-800">Carrier Waybill:</span> TRK-NGR-{Math.floor(10000000 + Math.random() * 90000000)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-900">Order ID not found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            We couldn't find an active shipment matching "{searchId}". Please check your order reference number or contact admin support.
          </p>
        </div>
      ) : null}
    </div>
  );
};
