import React from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersModalProps {
  orders: Order[];
  onBackToShop: () => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({ orders, onBackToShop }) => {
  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> Pending Verification</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"><Package className="w-3.5 h-3.5" /> Processing Warehouse</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full"><Truck className="w-3.5 h-3.5" /> Dispatched & Shipped</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered Successfully</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store Feed
          </button>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Your Order History & Tracking</h2>
          <p className="text-xs sm:text-sm text-stone-500">Monitor fulfillment status and delivery updates for all your orders.</p>
        </div>
        <span className="text-xs bg-stone-100 text-stone-800 font-semibold px-3.5 py-1.5 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
          <Package className="w-12 h-12 text-stone-400 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-stone-900">No orders placed yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you complete a checkout at Reemah World Import, your order tracking history will appear here.
          </p>
          <button
            onClick={onBackToShop}
            className="mt-2 bg-stone-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-stone-800 transition-colors"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Ordered on {new Date(order.createdAt).toLocaleString()} • Ref: {order.paymentReference}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500">Total Paid:</span>
                  <p className="text-lg font-bold text-amber-700">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Items in this Order</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                      <img src={item.mediaUrl} alt={item.title} className="w-14 h-14 object-cover rounded-lg border border-stone-200" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-stone-900 truncate">{item.title}</h5>
                        <p className="text-xs text-stone-500">{item.quantity}x @ {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 text-xs text-stone-700 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <span className="font-bold text-amber-900">Delivery Address:</span> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </div>
                <div>
                  <span className="font-bold text-amber-900">Contact:</span> {order.customerName} ({order.customerPhone})
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
