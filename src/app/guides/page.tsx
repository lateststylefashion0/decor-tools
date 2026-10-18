import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import { BookOpen, Ruler, Paintbrush, Lightbulb, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Improvement & Measurement Guides',
  description:
    'Comprehensive renovation measurement guidelines, trade calculation rules, and interior design formulas to help you plan home projects accurately.',
  alternates: {
    canonical: 'https://decortools.com/guides',
  },
};

const GUIDES = [
  {
    title: 'How to Size an Area Rug for Any Living Room Layout',
    category: 'Decor & Furniture',
    snippet:
      'Learn the designer golden rules: all legs on the rug vs front legs only. Understand standard room perimeter borders and bed rug sizing for Queen and King mattresses.',
    href: '/calculators/rug-size-calculator',
    readTime: '4 min read',
  },
  {
    title: 'The Contractor Guide to Flooring Waste Allowances',
    category: 'Paint & Flooring',
    snippet:
      'Why you should never order exact square footage. Discover why straight plank runs need 8-10% waste, while herringbone and diagonal patterns demand 15-20%.',
    href: '/calculators/flooring-calculator',
    readTime: '5 min read',
  },
  {
    title: 'Recessed Lighting Spacing: The Ceiling Height / 2 Formula',
    category: 'Lighting Planning',
    snippet:
      'Avoid dark room corners and glaring hot spots. Master the ceiling height division formula and calculate delivered lumens for ambient vs task spaces.',
    href: '/calculators/recessed-lighting-calculator',
    readTime: '6 min read',
  },
  {
    title: 'Curtain Fullness Explained: 1.5x, 2.0x, and 2.5x Fabric Ratios',
    category: 'Decor & Furniture',
    snippet:
      'Understand how gathered heading pleats transform flat fabric panels into elegant, cascading window treatments with proper rod overhangs and floor drops.',
    href: '/calculators/curtain-size-calculator',
    readTime: '4 min read',
  },
  {
    title: 'Drywall & Board Hanging Standards: Vertical vs Horizontal',
    category: 'Construction & Finishing',
    snippet:
      'Why residential building codes recommend hanging drywall horizontally across framing studs to eliminate vertical joint weaknesses and reduce taper time.',
    href: '/calculators/drywall-calculator',
    readTime: '5 min read',
  },
  {
    title: 'How Far to Sit from a 4K TV: THX & SMPTE Viewing Standards',
    category: 'Living & Audio-Visual',
    snippet:
      'Calculate the optimal screen diagonal from seating distance using Pythagorean geometry to achieve true 40-degree cinematic field of view.',
    href: '/calculators/tv-size-calculator',
    readTime: '4 min read',
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs items={[{ label: 'Guides' }]} />

      <div className="space-y-3 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Home Measurement & Renovation Guides
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">
          Practical tutorials, interior design proportions, and trade measurement rules to help you plan renovations with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((g, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {g.category}
                </span>
                <span className="text-stone-400">{g.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 hover:text-emerald-700 transition-colors">
                <Link href={g.href}>{g.title}</Link>
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {g.snippet}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-100">
              <Link
                href={g.href}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
              >
                <span>Read guide & use tool</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
