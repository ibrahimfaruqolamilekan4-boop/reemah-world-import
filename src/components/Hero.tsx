import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones, Search, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface HeroProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onExploreClick,
}) => {
  const categories: Category[] = [
    'All',
    'Kitchen Utensils',
    'Home Interior & Decor',
    'Electrical Goods',
    'Smart Home & Lighting',
  ];

  return (
    <div className="relative bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-800/40">
      {/* Esoteric glowing background orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Official Logo presentation in Hero */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-purple-400/30 shadow-xl shadow-purple-950/40">
            <img src="/logo2.jpg" alt="Logo" className="w-10 h-10 rounded-md object-cover bg-white p-0.5" />
            <span className="text-xs font-cinzel font-semibold tracking-widest text-amber-300 uppercase">
              REEMAH WORLD IMPORTS
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-cinzel font-black tracking-tight text-white leading-[1.1]">
            REEMAH WORLD <span className="gold-gradient-text">IMPORTS</span>
          </h1>

          <p className="text-purple-100/90 text-lg sm:text-xl max-w-2xl mx-auto font-luxury font-normal italic leading-relaxed">
            "We Import Quality, You Enjoy!" — Transcend ordinary commerce with direct factory curation of elite kitchenware, celestial home decor, and advanced electrical goods.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center shadow-2xl">
              <Search className="absolute left-5 w-5 h-5 text-purple-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search esoteric luxury goods, kitchen, appliances..."
                className="w-full bg-white/10 backdrop-blur-xl border border-purple-500/50 rounded-full pl-14 pr-32 py-4 text-sm text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-inner font-medium"
              />
              <button
                onClick={onExploreClick}
                className="absolute right-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-cinzel font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-900/40 border border-purple-400/30"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="mt-14 flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-purple-950 font-bold shadow-xl shadow-amber-400/20 scale-105'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:text-white border border-purple-500/30 backdrop-blur-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-10 border-t border-purple-800/60 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-purple-700/30 backdrop-blur-md shadow-lg">
            <div className="p-3.5 rounded-xl bg-purple-600/30 text-amber-300 border border-purple-400/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-cinzel font-bold text-white tracking-wide">Direct Factory Curation</h4>
              <p className="text-xs text-purple-200/80 font-medium">100% verified luxury standards</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-purple-700/30 backdrop-blur-md shadow-lg">
            <div className="p-3.5 rounded-xl bg-purple-600/30 text-amber-300 border border-purple-400/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-cinzel font-bold text-white tracking-wide">Secure Global Logistics</h4>
              <p className="text-xs text-purple-200/80 font-medium">Safe transit & swift dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-purple-700/30 backdrop-blur-md shadow-lg">
            <div className="p-3.5 rounded-xl bg-purple-600/30 text-amber-300 border border-purple-400/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-cinzel font-bold text-white tracking-wide">VIP Concierge Care</h4>
              <p className="text-xs text-purple-200/80 font-medium">Dedicated support via WhatsApp</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
