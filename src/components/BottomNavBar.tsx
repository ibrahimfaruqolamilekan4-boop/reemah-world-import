import React from 'react';
import { Home, LayoutGrid, MessageSquare, ShoppingCart } from 'lucide-react';

export const BottomNavBar = ({ page, setPage, cartCount, onOpenCart, onOpenChat, unreadCount }: any) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center sm:hidden z-50 pb-safe">
    <button onClick={() => setPage("home")} className={`flex flex-col items-center gap-1 ${page === "home" ? "text-[#4A1C6B]" : "text-gray-400"}`}>
      <Home className={`w-6 h-6 ${page === "home" ? "fill-[#4A1C6B]" : ""}`} />
      <span className="text-[10px] font-semibold">Home</span>
    </button>
    <button onClick={() => setPage("feed")} className={`flex flex-col items-center gap-1 ${page === "feed" ? "text-[#4A1C6B]" : "text-gray-400"}`}>
      <LayoutGrid className={`w-6 h-6 ${page === "feed" ? "fill-[#4A1C6B]" : ""}`} />
      <span className="text-[10px] font-semibold">Categories</span>
    </button>
    <button onClick={onOpenChat} className="flex flex-col items-center gap-1 text-gray-400 relative">
      <div className="relative">
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">{unreadCount}</span>}
      </div>
      <span className="text-[10px] font-semibold">Admin Chat</span>
    </button>
    <button onClick={onOpenCart} className="flex flex-col items-center gap-1 text-gray-400 relative">
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#D4A017] text-[#4A1C6B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
      <span className="text-[10px] font-semibold">Cart</span>
    </button>
  </div>
);
