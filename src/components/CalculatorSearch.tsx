'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../lib/registry';
import CalculatorCard from './CalculatorCard';

interface CalculatorSearchProps {
  initialCategory?: string;
  showCategoryFilters?: boolean;
}

export default function CalculatorSearch({
  initialCategory,
  showCategoryFilters = true,
}: CalculatorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

  const filtered = useMemo(() => {
    return CALCULATORS.filter(calc => {
      const matchesCategory =
        selectedCategory === 'All' || calc.category === selectedCategory;

      const q = searchTerm.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        calc.name.toLowerCase().includes(q) ||
        calc.shortDescription.toLowerCase().includes(q) ||
        calc.description.toLowerCase().includes(q) ||
        calc.keywords.some(k => k.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full space-y-8">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search calculators (e.g. rug, paint, tile, lighting, curtain)..."
            className="w-full pl-12 pr-10 py-3.5 bg-white text-stone-900 placeholder-stone-400 text-base rounded-2xl border border-stone-200/90 shadow-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            aria-label="Search all 20 calculators"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      {showCategoryFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            All 20 Calculators
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-sm font-medium text-stone-500">
            Showing <span className="font-bold text-stone-900">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'calculator' : 'calculators'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(calc => (
              <CalculatorCard key={calc.id} calculator={calc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8">
            <p className="text-lg font-semibold text-stone-800">No calculators found</p>
            <p className="text-sm text-stone-500 mt-1">
              Try searching for &quot;rug&quot;, &quot;flooring&quot;, &quot;drywall&quot;, or browse by category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
