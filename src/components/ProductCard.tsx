import React from 'react';
import { Heart, Star } from 'lucide-react';

export const ProductCard = ({ product: p, onOpen, onAddToCart, onToggleWishlist, isWishlisted }: any) => {
  const hasSale = p.oldPrice && p.oldPrice > p.price;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col relative h-full">
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => onOpen(p)}>
        <img src={p.mediaUrl} alt={p.title || p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        
        {hasSale && (
          <div className="absolute top-2 left-2 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            SALE
          </div>
        )}
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(p.id); }}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition z-10"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D4A017] text-[#D4A017]' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1">{p.category}</span>
        <h3 className="text-xs sm:text-sm font-semibold text-[#4A1C6B] line-clamp-2 leading-tight cursor-pointer hover:text-[#D4A017] transition" onClick={() => onOpen(p)}>
          {p.title || p.name}
        </h3>
        
        <div className="flex items-center gap-1 mt-1 mb-2">
          <Star className="w-3 h-3 fill-[#D4A017] text-[#D4A017]" />
          <span className="text-[10px] font-bold text-[#4A1C6B]">{p.rating || "5.0"}</span>
        </div>
        
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <span className="font-bold text-[#4A1C6B] text-sm sm:text-base">₦{p.price?.toLocaleString()}</span>
            {hasSale && (
              <span className="text-[10px] text-gray-400 line-through mb-0.5">₦{p.oldPrice?.toLocaleString()}</span>
            )}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
            className="w-full bg-[#D4A017] text-[#4A1C6B] hover:opacity-90 transition font-bold py-2 rounded-xl text-xs sm:text-sm shadow-sm"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
