
import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, User, Crown } from 'lucide-react';

export const Navbar = ({ 
  user, setIsAuthOpen, 
  totalCartCount, setIsCartOpen, 
  wishlist, setIsWishlistOpen,
  searchQuery, setSearchQuery,
  products = [], onOpenProduct,
  setPage
}: any) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Live search results
  const searchResults = searchQuery.trim() 
    ? products.filter((p: any) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      <div className="bg-[#4A1C6B] text-white px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg">
        {/* Left: Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setPage("home")}
        >
          <img src="/logo.jpg" alt="Reemah World Imports" className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-white rounded-md p-1" />
          <h1 className="font-display font-bold text-lg sm:text-xl tracking-wider text-white hidden sm:block">
            REEMAH WORLD IMPORTS
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 hover:text-[#D4A017] transition">
            <Search className="w-5 h-5" />
          </button>
          
          <button onClick={() => setIsWishlistOpen(true)} className="relative p-1 hover:text-[#D4A017] transition hidden sm:block">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="relative p-1 hover:text-[#D4A017] transition hidden sm:block">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {!user ? (
            <button onClick={() => setIsAuthOpen(true)} className="hidden sm:block p-1 hover:text-[#D4A017] transition">
              <User className="w-5 h-5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-[#D4A017] text-[#4A1C6B] font-bold text-xs">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 hover:text-[#D4A017] transition sm:hidden">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Dropdown / Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-gray-200 p-4 shadow-md absolute w-full left-0 top-16 z-50">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A1C6B]"
            />
            
            {/* Live Results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                {searchResults.map((p: any) => (
                  <div 
                    key={p.id} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    onClick={() => { onOpenProduct(p); setSearchOpen(false); setSearchQuery(""); }}
                  >
                    <img src={p.mediaUrl} alt={p.title} className="w-10 h-10 object-cover rounded-md" />
                    <div>
                      <div className="text-sm font-semibold text-[#4A1C6B]">{p.title}</div>
                      <div className="text-xs text-gray-500 font-medium">₦{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center text-sm text-gray-500">
                No products found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 flex flex-col gap-2 z-50">
          <button onClick={() => { setPage("home"); setMobileMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-[#4A1C6B] bg-gray-50 rounded-xl">Home</button>
          <button onClick={() => { setPage("feed"); setMobileMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-[#4A1C6B] bg-gray-50 rounded-xl">Categories</button>
          {user?.isAdmin && (
            <button onClick={() => { setPage("admin"); setMobileMenuOpen(false); }} className="text-left px-4 py-3 font-bold text-[#D4A017] bg-[#4A1C6B] rounded-xl">Admin Dashboard</button>
          )}
          {!user ? (
            <button onClick={() => { setIsAuthOpen(true); setMobileMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-white bg-[#4A1C6B] rounded-xl mt-2 flex items-center gap-2">
              <User className="w-4 h-4" /> Sign In
            </button>
          ) : (
            <button onClick={() => { setPage("orderHistory"); setMobileMenuOpen(false); }} className="text-left px-4 py-3 font-semibold text-[#4A1C6B] bg-gray-50 rounded-xl">My Orders</button>
          )}
        </div>
      )}
    </header>
  );
};
