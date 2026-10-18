import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Use & Construction Disclaimer | DecorTools',
  description: 'Terms of use and disclaimer for DecorTools home improvement calculators.',
  alternates: {
    canonical: 'https://decortools.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ label: 'Terms of Use' }]} />

      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
        Terms of Use & Disclaimer
      </h1>

      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 text-sm text-stone-700 leading-relaxed">
        <h2 className="text-lg font-bold text-stone-900">1. Acceptance of Terms</h2>
        <p>
          By accessing and using DecorTools, you agree to comply with and be bound by these Terms of Use. If you do not agree, please discontinue using the website.
        </p>

        <h2 className="text-lg font-bold text-stone-900">2. Estimating & Trade Disclaimer</h2>
        <p>
          The calculators provided on DecorTools are designed solely for general spatial planning, budgeting, and educational purposes. While every formula has been developed to mirror standard construction and interior design conventions, actual material requirements depend on building conditions, contractor skill, site obstructions, wall plumbness, and manufacturer batch variances.
        </p>
        <p>
          Users must always verify physical measurements on-site and consult certified contractors, architects, or product suppliers before purchasing building materials or commencing demolition/construction. DecorTools assumes no liability for material deficits, project delays, or installation errors.
        </p>

        <h2 className="text-lg font-bold text-stone-900">3. Intellectual Property</h2>
        <p>
          The calculations, layout designs, trademarks, and written guidance on DecorTools are protected by copyright and intellectual property laws.
        </p>
      </div>
    </div>
  );
}
