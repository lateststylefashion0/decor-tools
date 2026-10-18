import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | DecorTools',
  description: 'DecorTools privacy policy. We do not store or collect your home measurements.',
  alternates: {
    canonical: 'https://decortools.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
        Privacy Policy
      </h1>

      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 text-sm text-stone-700 leading-relaxed">
        <p>
          At DecorTools, your privacy is paramount. This Privacy Policy details our practices regarding information collection, storage, and usage.
        </p>

        <h2 className="text-lg font-bold text-stone-900">1. Client-Side Calculations</h2>
        <p>
          All 20 calculators on DecorTools execute entirely within your web browser using client-side JavaScript. Measurements, room dimensions, material options, and financial estimates you enter into our forms are never transmitted to, stored on, or analyzed by any external server or backend database.
        </p>

        <h2 className="text-lg font-bold text-stone-900">2. Cookies and Analytics</h2>
        <p>
          We do not use invasive tracking cookies or sale of personal data. Basic anonymous web traffic metrics may be collected for the sole purpose of ensuring website performance, page load speeds, and error monitoring.
        </p>

        <h2 className="text-lg font-bold text-stone-900">3. Third-Party Links</h2>
        <p>
          Our website may reference external resources or manufacturer guidelines. We are not responsible for the privacy practices of external third-party sites.
        </p>
      </div>
    </div>
  );
}
