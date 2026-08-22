import React from 'react';

const CATEGORIES = ["All", "Kitchenware", "Home Interior", "Electrical Appliances", "Fashion"];

export const CategoryStrip = ({ setPage, setCategoryFilter, currentFilter }: any) => (
  <section className="bg-gray-50 py-8">
    <div className="max-w-6xl mx-auto px-4">
      <h3 className="font-display text-xl font-semibold mb-4 text-[#4A1C6B]">Shop by category</h3>
      <div className="flex overflow-x-auto whitespace-nowrap gap-3 pb-4 no-scrollbar">
        <button 
          onClick={() => { setCategoryFilter(null); setPage("feed"); }}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition shadow-sm ${!currentFilter ? 'bg-[#4A1C6B] text-white border-[#4A1C6B]' : 'bg-white text-[#4A1C6B] border-gray-200 hover:bg-gray-100'}`}
        >
          All
        </button>
        {CATEGORIES.filter(c => c !== "All").map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategoryFilter(cat); setPage("feed"); }}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold border transition shadow-sm ${currentFilter === cat ? 'bg-[#4A1C6B] text-white border-[#4A1C6B]' : 'bg-white text-[#4A1C6B] border-gray-200 hover:bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  </section>
);
