import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Mail, MessageSquare, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Home Space Calc | Feedback & Tool Suggestions',
  description:
    'Have a question about a calculation formula or wish to suggest a new home decor tool? Reach out to the Home Space Calc development team.',
  alternates: {
    canonical: 'https://homespacecalc.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Contact Us
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Have feedback on our formulas, found an edge case, or want to suggest a new home improvement calculator? We would love to hear from you.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <form className="space-y-4" onSubmit={undefined}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
              Subject / Tool Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Paint Calculator formula feedback"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="How can we assist you?"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
