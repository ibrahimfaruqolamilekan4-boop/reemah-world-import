import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, ShoppingBag, Star, CheckCircle, AlertTriangle, Eye, Send, Sparkles } from 'lucide-react';
import { Product, UserProfile } from '../types';

interface ProductFeedProps {
  products: Product[];
  user: UserProfile | null;
  onToggleLike: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  onAddToCart: (product: Product) => void;
  onAddComment: (productId: string, commentText: string, rating: number) => void;
  setIsAuthOpen: (open: boolean) => void;
}

export const ProductFeed: React.FC<ProductFeedProps> = ({
  products,
  user,
  onToggleLike,
  onToggleWishlist,
  wishlist,
  onAddToCart,
  onAddComment,
  setIsAuthOpen,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return '₦' + price.toLocaleString();
  };

  const handleShare = async (product: Product) => {
    const title = typeof product.title === 'string' ? product.title : 'Reemah World Import';
    const text = `Check out "${title}" (${formatPrice(product.price)}) at Reemah World Import! Premium goods direct from China.`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
      } catch {}
    }
  };

  const submitComment = (productId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (!commentInput.trim()) return;
    onAddComment(productId, commentInput.trim(), ratingInput);
    setCommentInput('');
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-50 rounded-2xl border border-dashed border-stone-300 my-10 max-w-4xl mx-auto px-4">
        <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-stone-900">No products found</h3>
        <p className="text-stone-500 text-sm mt-1">Try searching for something else or clearing your category filters.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Community Product Feed</h2>
          <p className="text-xs sm:text-sm text-stone-500">Discover latest arrivals, read reviews, and order instantly.</p>
        </div>
        <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-3 py-1 rounded-full">
          {products.length} {products.length === 1 ? 'Item' : 'Items'} Available
        </span>
      </div>

      <div className="space-y-8">
        {products.map((product) => {
          const isLiked = user ? product.likes.includes(user.uid) : false;
          const isWishlisted = wishlist.includes(product.id);
          const isOutOfStock = product.stock <= 0;

          return (
            <article
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs">
                    RW
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      Reemah World Import Official
                      <CheckCircle className="w-4 h-4 text-amber-600 fill-amber-100" />
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {new Date(product.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} • <span className="text-amber-700 font-medium">{product.category}</span>
                    </span>
                  </div>
                </div>

                {/* Wishlist button */}
                <button
                  onClick={() => {
                    if (!user) { setIsAuthOpen(true); return; }
                    onToggleWishlist(product.id);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? 'bg-rose-50 text-rose-600' : 'text-stone-400 hover:bg-stone-100'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Product Media */}
              <div className="relative bg-stone-900 aspect-video sm:aspect-[16/10] overflow-hidden group cursor-pointer" onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}>
                <img
                  src={product.mediaUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Stock badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-stone-900/80 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full border border-stone-700">
                    {product.category}
                  </span>
                  {isOutOfStock ? (
                    <span className="bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="bg-amber-500 text-stone-950 font-bold text-xs px-3 py-1 rounded-full">
                      Only {product.stock} left!
                    </span>
                  ) : null}
                </div>

                {/* Quick view hover overlay */}
                <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-md text-stone-900 font-semibold px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Quick View & Details
                  </span>
                </div>
              </div>

              {/* Post Details */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-amber-700">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Rating & Stats row */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-stone-800">{product.ratingAverage.toFixed(1)}</span>
                    <span>({product.comments.length} reviews)</span>
                  </div>
                  <div>
                    <span>{product.likes.length} likes</span> • <span>{product.comments.length} comments</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (!user) { setIsAuthOpen(true); return; }
                      onToggleLike(product.id);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isLiked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                    <span>Comment ({product.comments.length})</span>
                  </button>

                  <button
                    onClick={() => handleShare(product)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-all"
                  >
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart — ' + formatPrice(product.price)}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Quick View / Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
              <h3 className="font-serif font-bold text-lg text-stone-900 truncate max-w-md">
                {selectedProduct.title}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media viewer */}
              <div className="space-y-3">
                <div className="aspect-video rounded-2xl overflow-hidden bg-stone-900 shadow-inner">
                  <img
                    src={selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0 ? selectedProduct.additionalImages[activeImageIndex] || selectedProduct.mediaUrl : selectedProduct.mediaUrl}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      onClick={() => setActiveImageIndex(0)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${activeImageIndex === 0 ? 'border-amber-600' : 'border-stone-200'}`}
                    >
                      <img src={selectedProduct.mediaUrl} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                    {selectedProduct.additionalImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx + 1)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${activeImageIndex === idx + 1 ? 'border-amber-600' : 'border-stone-200'}`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-amber-700">{formatPrice(selectedProduct.price)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="ml-3 text-sm text-stone-400 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="bg-stone-100 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  Stock: {selectedProduct.stock} units available
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Product Description</h4>
                <p className="text-stone-700 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => {
                  onAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                disabled={selectedProduct.stock <= 0}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Shopping Cart — {formatPrice(selectedProduct.price)}</span>
              </button>

              {/* Reviews & Comments Section */}
              <div className="border-t border-stone-200 pt-6 space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <span>Customer Reviews & Comments</span>
                  <span className="text-xs font-sans bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {selectedProduct.comments.length}
                  </span>
                </h4>

                {/* Comment list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedProduct.comments.length === 0 ? (
                    <p className="text-sm text-stone-400 italic py-4 text-center">No reviews yet. Be the first to leave feedback!</p>
                  ) : (
                    selectedProduct.comments.map((c) => (
                      <div key={c.id} className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{c.userName}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < c.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-stone-600">{c.comment}</p>
                        <span className="text-[10px] text-stone-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Add comment form */}
                <div className="bg-stone-100 p-4 rounded-2xl space-y-3">
                  <h5 className="text-xs font-bold text-stone-800 uppercase">Leave a Review & Rating</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRatingInput(num)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${num <= ratingInput ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your feedback about this product..."
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => submitComment(selectedProduct.id)}
                      className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
