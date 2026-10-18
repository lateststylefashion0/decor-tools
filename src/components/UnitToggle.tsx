'use client';

import React from 'react';
import { UnitSystem } from '../types/calculator';

interface UnitToggleProps {
  unit: UnitSystem;
  onChange: (unit: UnitSystem) => void;
  imperialLabel?: string;
  metricLabel?: string;
}

export default function UnitToggle({
  unit,
  onChange,
  imperialLabel = 'Feet & Inches',
  metricLabel = 'Meters & Centimeters',
}: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Measurement Unit Selection"
      className="inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200/80 shadow-inner w-full sm:w-auto"
    >
      <button
        type="button"
        onClick={() => onChange('imperial')}
        className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
          unit === 'imperial'
            ? 'bg-emerald-700 text-white shadow-sm'
            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
        }`}
        aria-pressed={unit === 'imperial'}
      >
        {imperialLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange('metric')}
        className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
          unit === 'metric'
            ? 'bg-emerald-700 text-white shadow-sm'
            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
        }`}
        aria-pressed={unit === 'metric'}
      >
        {metricLabel}
      </button>
    </div>
  );
}
