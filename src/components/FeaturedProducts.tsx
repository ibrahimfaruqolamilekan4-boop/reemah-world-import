import React from 'react';
import { Package } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const FeaturedProducts = ({ products, onOpen, onAddToCart, onToggleWishlist, wishlist }: any) => (
  <section className="py-12 bg-gray-50/50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-center mb-8 text-[#4A1C6B]">
        Premium Inventory
      </h2>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500 font-semibold">No products available yet.</p>
          <p className="text-xs text-gray-400 mt-2">Products uploaded by admin will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 8).map((p: any) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onOpen={onOpen} 
              onAddToCart={onAddToCart} 
              onToggleWishlist={onToggleWishlist} 
              isWishlisted={wishlist.includes(p.id)} 
            />
          ))}
        </div>
      )}
    </div>
  </section>
);
