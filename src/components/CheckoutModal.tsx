import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Building, Smartphone, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { CartItem, Order, UserProfile } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: UserProfile | null;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  onOrderComplete,
}) => {
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos State');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd' | 'mobile_money'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = 3500;
  const totalAmount = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city) {
      alert('Please fill in all required delivery and contact details.');
      return;
    }

    setIsProcessing(true);

    // Simulate Paystack payment verification & order creation
    setTimeout(() => {
      const newOrder: Order = {
        id: 'RW-' + Math.floor(100000 + Math.random() * 900000),
        userId: user ? user.uid : 'guest-' + Date.now(),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          street,
          city,
          state,
          country: 'Nigeria',
        },
        items: cart.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
          mediaUrl: i.product.mediaUrl,
        })),
        totalAmount,
        paymentMethod,
        paymentReference: 'PAYSTACK-REF-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderComplete(newOrder);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-lg text-stone-900">Secure Paystack Checkout</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {completedOrder ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-stone-900">Order Placed Successfully!</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for shopping with Reemah World Import. Your payment has been verified via Paystack.
                </p>
                <div className="inline-block bg-stone-100 px-4 py-2 rounded-xl text-xs font-mono font-bold text-stone-800 mt-2">
                  Order ID: {completedOrder.id} • Ref: {completedOrder.paymentReference}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left max-w-md mx-auto space-y-2 text-xs text-stone-700">
                <h4 className="font-bold text-amber-900">Delivery Information:</h4>
                <p><span className="font-semibold">Recipient:</span> {completedOrder.customerName} ({completedOrder.customerPhone})</p>
                <p><span className="font-semibold">Address:</span> {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}</p>
                <p><span className="font-semibold">Total Paid:</span> {formatPrice(completedOrder.totalAmount)}</p>
              </div>

              <button
                onClick={onClose}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md"
              >
                Return to Store Feed
              </button>
            </div>
          ) : isProcessing ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-stone-900">Processing Secure Payment...</h3>
                <p className="text-sm text-stone-500">Connecting to Paystack gateway for {formatPrice(totalAmount)}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              
              {/* Order Summary box */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Order Summary</h4>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-xs text-stone-700">
                      <span>{item.quantity}x {item.product.title}</span>
                      <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total (incl. Delivery {formatPrice(deliveryFee)})</span>
                  <span className="text-amber-700">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900">1. Contact & Delivery Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zainab Ahmed"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. zainab@gmail.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08031234567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Lagos State">Lagos State</option>
                      <option value="Abuja FCT">Abuja FCT</option>
                      <option value="Rivers State">Rivers State</option>
                      <option value="Oyo State">Oyo State</option>
                      <option value="Kano State">Kano State</option>
                      <option value="Other State">Other State in Nigeria</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 14 Ademola Adetokunbo Crescent"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ikeja"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-stone-900">2. Select Payment Method (Paystack)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      paymentMethod === 'card' ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20' : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">Debit Card</span>
                    <span className="text-[10px] text-stone-400">Mastercard/Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      paymentMethod === 'bank_transfer' ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20' : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Building className={`w-5 h-5 ${paymentMethod === 'bank_transfer' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">Bank Transfer</span>
                    <span className="text-[10px] text-stone-400">Instant validation</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ussd')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      paymentMethod === 'ussd' ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20' : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'ussd' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">USSD Code</span>
                    <span className="text-[10px] text-stone-400">*737#, *901#</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      paymentMethod === 'mobile_money' ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20' : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${paymentMethod === 'mobile_money' ? 'text-amber-600' : 'text-stone-500'}`} />
                    <span className="text-xs font-bold text-stone-900">Mobile Money</span>
                    <span className="text-[10px] text-stone-400">OPay, Moniepoint</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                id="pay-now-btn"
              >
                <span>Pay {formatPrice(totalAmount)} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
