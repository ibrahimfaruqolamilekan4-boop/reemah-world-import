import React from 'react';
import { Sparkles, ShieldCheck, Globe, Award, HeartHandshake } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      
      {/* Brand Hero Story */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold shadow-sm">
          <img src="/logo.jpg" alt="Logo" className="w-5 h-5 rounded object-cover" />
          <span className="font-cinzel tracking-wider">Esoteric Global Import Sanctuary</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-cinzel font-black text-slate-950 tracking-tight">
          About Reemah World <span className="purple-gradient-text">Imports</span>
        </h2>
        <p className="text-slate-700 text-lg sm:text-xl leading-relaxed font-luxury italic">
          "We Import Quality, You Enjoy!" — Curating elite kitchen utensils, celestial home interior decor, and state-of-the-art electrical goods directly from premier manufacturers to discerning sanctuaries worldwide.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-3 p-6 rounded-2xl bg-purple-50/60 border border-purple-200/80 shadow-sm">
            <h3 className="text-xl font-cinzel font-bold text-purple-950">Our Founder's Vision</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              Founded with an uncompromising devotion to elegance and resilience, Reemah World Imports bridges world-class international manufacturing hubs with clients who demand refinement. Every collection is rigorously vetted for durability, esoteric beauty, and wholesale value.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-purple-50/60 border border-purple-200/80 shadow-sm">
            <h3 className="text-xl font-cinzel font-bold text-purple-950">The Esoteric Standard</h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              By eliminating intermediary channels and forging direct alliances with master artisans and factories in Guangzhou and Yiwu, we deliver superior 304 stainless steel, certified electrical systems, and immaculate home decor.
            </p>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-200 aspect-square bg-purple-950">
          <img
            src="/logo.jpg"
            alt="Reemah World Imports Emblem"
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/20 to-transparent flex items-end p-8">
            <div className="text-white space-y-1.5">
              <p className="text-xs font-cinzel font-semibold tracking-widest text-amber-300 uppercase">Direct Sanctuary Sourcing</p>
              <h4 className="font-cinzel text-xl font-bold">Uncompromising Luxury Standards</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-purple-100">
        <div className="bg-white p-7 rounded-2xl border border-purple-200/80 shadow-lg shadow-purple-900/5 space-y-3.5 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-amber-300 flex items-center justify-center shadow-md">
            <Globe className="w-6 h-6" />
          </div>
          <h4 className="font-cinzel font-bold text-slate-900 text-lg">Global Sourcing</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Sourced exclusively from certified master factories with rigorous multi-point quality inspections.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-purple-200/80 shadow-lg shadow-purple-900/5 space-y-3.5 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-amber-300 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-cinzel font-bold text-slate-900 text-lg">Verified Durability</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Corrosion-resistant steel, certified electrical safety, and immaculate shockproof transit packaging.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-purple-200/80 shadow-lg shadow-purple-900/5 space-y-3.5 hover:border-purple-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-amber-300 flex items-center justify-center shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="font-cinzel font-bold text-slate-900 text-lg">VIP Concierge</h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Dedicated support via WhatsApp and expedited secure delivery to your sanctuary doorstep.
          </p>
        </div>
      </div>

    </div>
  );
};
