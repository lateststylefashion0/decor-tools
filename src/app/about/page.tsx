import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ShieldCheck, Compass, CheckCircle2, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About DecorTools | Precision Home Improvement Calculations',
  description:
    'Learn about DecorTools, our commitment to mathematical calculation accuracy, trade standards, and accessible design tools for homeowners and contractors.',
  alternates: {
    canonical: 'https://decortools.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          About DecorTools
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          DecorTools is dedicated to providing homeowners, interior designers, DIY enthusiasts, and trade professionals with free, reliable, and mathematically accurate calculation tools.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm leading-relaxed text-stone-700">
        <h2 className="text-xl font-bold text-stone-900">Our Mission</h2>
        <p>
          Home renovation and interior decorating should be creative and exciting, not derailed by confusing unit conversions, material shortages, or unexpected package costs. We created DecorTools to eliminate guesswork by turning standard architectural trade formulas into simple, instant calculators.
        </p>

        <h2 className="text-xl font-bold text-stone-900 pt-2">Why Our Tools Stand Apart</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-bold text-stone-900 text-sm">Real Mathematical Formulas</h3>
            <p className="text-xs text-stone-600">
              No arbitrary approximations or black-box guesses. We document every formula and step-by-step calculation directly on each page.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-bold text-stone-900 text-sm">Active Unit Conversion</h3>
            <p className="text-xs text-stone-600">
              Switching from Imperial to Metric mathematically recalculates existing measurements into accurate meters and centimeters.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-bold text-stone-900 text-sm">Trade Packaging Logic</h3>
            <p className="text-xs text-stone-600">
              Calculations account for real purchasing constraints: round-up logic for full cans, flooring boxes, drywall sheets, and wallpaper rolls.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h3 className="font-bold text-stone-900 text-sm">Privacy & Instant Speed</h3>
            <p className="text-xs text-stone-600">
              100% client-side calculations. No tracking of personal home dimensions, no accounts, and no paid subscriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
