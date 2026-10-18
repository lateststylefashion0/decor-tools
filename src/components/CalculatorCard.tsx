import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CalculatorMeta } from '../types/calculator';
import CalculatorThumbnail from './CalculatorThumbnail';

interface CalculatorCardProps {
  calculator: CalculatorMeta;
}

export default function CalculatorCard({ calculator }: CalculatorCardProps) {
  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all duration-200 overflow-hidden"
    >
      {/* Visual illustration top header */}
      <div className="relative h-40 bg-gradient-to-b from-stone-100 to-stone-50 border-b border-stone-100 flex items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <CalculatorThumbnail id={calculator.id} />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-2">
            {calculator.category}
          </span>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
            {calculator.name}
          </h3>
          <p className="mt-1.5 text-sm text-stone-600 line-clamp-2 leading-snug">
            {calculator.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
          <span>Calculate Now</span>
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
