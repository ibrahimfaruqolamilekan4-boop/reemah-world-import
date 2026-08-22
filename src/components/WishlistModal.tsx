import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onAddToCart,
  onRemoveWishlist,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const formatPrice = (price: number) => '₦' + price.toLocaleString();

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Your Saved Wishlist</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="font-bold text-stone-900 text-base">Your wishlist is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Tap the heart icon on any product post in the feed to save items for later.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div key={product.id} className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 items-center">
                <img src={product.mediaUrl} alt={product.title} className="w-20 h-20 object-cover rounded-xl border border-stone-200 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold text-stone-900 truncate">{product.title}</h4>
                  <p className="text-xs font-bold text-amber-700">{formatPrice(product.price)}</p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveWishlist(product.id);
                      }}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
