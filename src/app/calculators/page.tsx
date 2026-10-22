import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import CalculatorSearch from '../../components/CalculatorSearch';

export const metadata: Metadata = {
  title: 'All 20 Free Home Decor & Renovation Calculators',
  description:
    'Browse all 20 free home improvement calculators for rug sizing, curtains, paint, flooring, tiles, recessed lights, chandeliers, TV size, drywall, baseboard, and room dimensions.',
  alternates: {
    canonical: 'https://homespacecalc.com/calculators',
  },
};

export default function CalculatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ label: 'Calculators' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          All 20 Home Decor & Renovation Calculators
        </h1>
        <p className="text-base text-stone-600 max-w-3xl leading-relaxed">
          Select any tool below to calculate materials, dimensions, and trade estimates in either Imperial (feet/inches) or Metric (meters/centimeters) units.
        </p>
      </div>

      <CalculatorSearch showCategoryFilters={true} />
    </div>
  );
}
