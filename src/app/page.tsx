import React from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ruler,
  Paintbrush,
  Lightbulb,
  Sofa,
  Hammer,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../lib/registry';
import CalculatorSearch from '../components/CalculatorSearch';
import CalculatorCard from '../components/CalculatorCard';
import FAQAccordion from '../components/FAQAccordion';

const POPULAR_SLUGS = [
  'rug-size-calculator',
  'paint-calculator',
  'flooring-calculator',
  'curtain-size-calculator',
  'recessed-lighting-calculator',
  'tv-size-calculator',
];

const HOMEPAGE_FAQS = [
  {
    question: 'Are all 20 calculators free to use?',
    answer:
      'Yes, 100% free with no account creation, no sign-ups, and no paywalls. All calculations run client-side in your browser for instant privacy and speed.',
  },
  {
    question: 'How does switching between Imperial and Metric units work?',
    answer:
      'Our calculators use high-precision physical conversion factors. When you toggle from Imperial (feet/inches) to Metric (meters/centimeters), your existing input numbers are automatically converted to their exact metric equivalents, rather than simply changing unit labels.',
  },
  {
    question: 'Why do material calculators include a waste allowance?',
    answer:
      'In real-world construction and decorating, cutting planks, trimming tiles around corners, and matching wallpaper pattern repeats inevitably produces offcuts and scrap. Factoring in a 5% to 15% waste margin prevents project delays and costly re-ordering.',
  },
  {
    question: 'Can I use these calculations for professional contractor quotes?',
    answer:
      'Our calculators provide mathematically accurate trade estimates following industry guidelines. However, because field conditions, wall plumbness, and manufacturer packaging can vary, we always recommend verifying field measurements before ordering materials.',
  },
];

export default function HomePage() {
  const popularCalculators = CALCULATORS.filter(c => POPULAR_SLUGS.includes(c.slug));

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-stone-50/50 via-[#fcfbf9] to-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            20 Precision Renovation & Design Tools
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 max-w-4xl mx-auto leading-tight">
            Home Improvement Calculators for <span className="text-emerald-700">Smarter Spaces</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Free, easy-to-use tools for your home decor and renovation projects. Plan, calculate, and design with confidence in Imperial or Metric units.
          </p>

          {/* Three Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 shadow-2xs text-xs sm:text-sm font-semibold text-stone-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Free Tools <span className="font-normal text-stone-500">(No sign-up needed)</span></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 shadow-2xs text-xs sm:text-sm font-semibold text-stone-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Accurate Results <span className="font-normal text-stone-500">(For real projects)</span></span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 shadow-2xs text-xs sm:text-sm font-semibold text-stone-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Both Units <span className="font-normal text-stone-500">(Feet/Inches & Metric)</span></span>
            </div>
          </div>

          {/* Search Bar directly embedded in Hero */}
          <div className="pt-6 max-w-3xl mx-auto">
            <CalculatorSearch showCategoryFilters={false} />
          </div>
        </div>
      </section>

      {/* Popular Calculators Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Trending Renovations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Popular Calculators
            </h2>
          </div>
          <Link
            href="/calculators"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View All 20 Tools</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCalculators.map(calc => (
            <CalculatorCard key={calc.id} calculator={calc} />
          ))}
        </div>
      </section>

      {/* All 20 Calculators Directory with Live Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="all-calculators">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Comprehensive Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Our Calculators
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Explore 20 free home decor and home improvement calculators, each powered by genuine trade formulas.
          </p>
        </div>

        <CalculatorSearch showCategoryFilters={true} />
      </section>

      {/* How the Calculators Work / Educational Section */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Calculation Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              How Home Space Calc Works
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every tool on Home Space Calc is engineered with real architectural geometry, trade conventions, and manufacturing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-stone-900">Physical Unit Precision</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                We use high-precision physical conversion factors (e.g. 1 meter = 3.28084 feet; 1 sq m = 10.7639 sq ft). Toggling units converts existing numbers seamlessly instead of just changing text labels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-stone-900">Practical Waste Allowances</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Flooring, tiles, and wallpapers require cutting around walls, doors, and complex angles. Our algorithms factor configurable waste margins (5% to 20%) to prevent material shortages.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-stone-900">Commercial Packaging Rules</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Building suppliers sell paint in full gallons, flooring in full boxes, and drywall in full sheets. We always round up purchasing quantities to the next whole package so you are never left short.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Renovation Guides & Tips Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Expert Advice
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Home Improvement & Decorating Guides
            </h2>
          </div>
          <Link
            href="/guides"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Browse All Guides</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Living Room
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              The Golden Rules of Area Rug Sizing
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Why an undersized rug shrinks your room, how to arrange furniture feet, and standard rug size formulas for Queen and King bedrooms.
            </p>
            <Link
              href="/calculators/rug-size-calculator"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Try Rug Calculator &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Flooring & Tile
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Calculating Accurate Flooring Waste Factors
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              How room geometry, hallway transitions, herringbone patterns, and closet cutouts determine whether you need a 7%, 10%, or 15% waste buffer.
            </p>
            <Link
              href="/calculators/flooring-calculator"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Try Flooring Calculator &rarr;
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Lighting Design
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Recessed Lighting Spacing: Height &divide; 2 Rule
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Eliminate dark perimeter shadows and harsh glare. Learn how ceiling height dictates fixture distance and target lumens.
            </p>
            <Link
              href="/calculators/recessed-lighting-calculator"
              className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-2"
            >
              Try Lighting Calculator &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-600">
            Common questions regarding our calculation accuracy and measurement conversions.
          </p>
        </div>

        <FAQAccordion items={HOMEPAGE_FAQS} />
      </section>
    </div>
  );
}
