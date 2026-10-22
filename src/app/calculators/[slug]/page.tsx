import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CALCULATORS, getCalculatorBySlug, getRelatedCalculators } from '../../../lib/registry';
import Breadcrumbs from '../../../components/Breadcrumbs';
import CalculatorDispatcher from '../../../components/CalculatorDispatcher';
import FAQAccordion from '../../../components/FAQAccordion';
import DisclaimerBanner from '../../../components/DisclaimerBanner';
import CalculatorCard from '../../../components/CalculatorCard';
import { BookOpen, Calculator, HelpCircle, Lightbulb, ChevronRight } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all 20 calculators for SSG pre-rendering
export async function generateStaticParams() {
  return CALCULATORS.map(calc => ({
    slug: calc.slug,
  }));
}

// Dynamic SEO metadata per calculator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) {
    return {
      title: 'Calculator Not Found',
    };
  }

  const title = `${calc.name} | Free Online Estimator`;
  const description = `${calc.description} Free, instant calculations with Imperial (feet/inches) and Metric support.`;

  return {
    title,
    description,
    keywords: calc.keywords,
    alternates: {
      canonical: `https://homespacecalc.com/calculators/${calc.slug}`,
    },
    openGraph: {
      title: `${calc.name} | Home Space Calc`,
      description,
      url: `https://homespacecalc.com/calculators/${calc.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${calc.name} | Home Space Calc`,
      description,
    },
  };
}

export default function CalculatorPage({ params }: PageProps) {
  const calc = getCalculatorBySlug(params.slug);
  if (!calc) {
    notFound();
  }

  const related = getRelatedCalculators(calc.relatedSlugs);

  // WebApplication Structured Data JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calc.name,
    description: calc.description,
    url: `https://homespacecalc.com/calculators/${calc.slug}`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Calculators', href: '/calculators' },
          { label: calc.name },
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          {calc.category}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
          {calc.name}
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {calc.description}
        </p>
      </div>

      {/* Interactive Calculator Form & Results */}
      <section aria-label={`${calc.name} Tool`}>
        <CalculatorDispatcher slug={calc.slug} />
      </section>

      {/* Formula Explanation & How It Works */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 text-stone-900 font-bold text-xl pb-3 border-b border-stone-100">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h2>How It Works & Calculation Formula</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-800">
            Formula Summary: <span className="font-normal text-stone-600">{calc.formulaSummary}</span>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
              Step-by-Step Calculation:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-stone-600 leading-relaxed pl-1">
              {calc.formulaSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span className="text-stone-800 font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Worked Example */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-stone-900">
          Worked Example Calculation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Sample Inputs:
            </p>
            <ul className="space-y-1 text-stone-700 text-xs">
              {Object.entries(calc.exampleInputs).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="font-medium text-stone-500">{k}:</span>
                  <span className="font-semibold text-stone-900">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Expected Output:
            </p>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              {calc.exampleOutput}
            </p>
          </div>
        </div>
      </section>

      {/* Practical Tips & Guidelines */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 text-stone-900 font-bold text-xl pb-2 border-b border-stone-100">
          <Lightbulb className="w-5 h-5 text-emerald-700" />
          <h2>Practical Tips & Trade Guidelines</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600 leading-relaxed pt-2">
          {calc.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Frequently Asked Questions */}
      {calc.faqs && calc.faqs.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-2xl">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <FAQAccordion items={calc.faqs} />
        </section>
      )}

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Related Calculators */}
      {related.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
              Related Calculators
            </h2>
            <Link
              href="/calculators"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View all tools</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(r => (
              <CalculatorCard key={r.id} calculator={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
