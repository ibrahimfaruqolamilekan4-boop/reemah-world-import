import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 3500 : 0;
  const grandTotal = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Your Shopping Cart</h3>
                <p className="text-xs text-stone-500">{cart.reduce((a, c) => a + c.quantity, 0)} items selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">Your cart is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our community feed and add luxury items directly imported from China to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-stone-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-stone-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 items-center"
                >
                  <img
                    src={item.product.mediaUrl}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-bold text-stone-900 truncate">{item.product.title}</h4>
                    <p className="text-xs font-bold text-amber-700">{formatPrice(item.product.price)}</p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-lg px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Delivery (Nationwide)</span>
                  <span className="font-semibold text-stone-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-amber-700">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                id="proceed-checkout-btn"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-stone-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Secured by Paystack • Cards, USSD & Bank Transfers
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
