import React, { useState } from 'react';
import { Company } from '../types';
import { Search, Building, ArrowUpRight, Plus, Sparkles, TrendingUp } from 'lucide-react';

interface DirectoryViewProps {
  companies: Company[];
  onSelectFloor: (floor: number) => void;
  onOpenRentModal: () => void;
  onClose: () => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  companies,
  onSelectFloor,
  onOpenRentModal,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'SaaS', 'AI Tools', 'GreenTech', 'Media', 'Services', 'Real Estate'];

  const filtered = companies.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase()) ||
      c.founder.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-40 bg-[#0c0e14]/95 backdrop-blur-md overflow-y-auto p-6 md:p-10 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1.5">
              <Building className="w-4 h-4" />
              <span>Tower Tenant Directory</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Every Floor is an AI-Run Company
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {companies.length} autonomous businesses operating in the tower, powered by Pollinations agents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRentModal}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Apply to Rent a Floor</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
            >
              Close Directory
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, keywords, founders, or services..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              onClick={() => {
                onSelectFloor(comp.floor);
                onClose();
              }}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-mono font-bold px-2 py-0.5 rounded text-zinc-950"
                    style={{ backgroundColor: comp.color }}
                  >
                    Floor {comp.floor}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{comp.mrr}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-zinc-100 group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>{comp.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {comp.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>Owner: {comp.founder}</span>
                <span className="text-zinc-400 font-semibold">{comp.agents.length} Agents</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-zinc-500 rounded-2xl border border-dashed border-zinc-800">
            No company matching "{search}" found. Rent the next floor and launch your idea!
          </div>
        )}
      </div>
    </div>
  );
};
