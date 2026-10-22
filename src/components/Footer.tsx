import React from 'react';
import Link from 'next/link';
import { Home, ShieldCheck, Heart } from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../lib/registry';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Home Space <span className="text-emerald-400">Calc</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed pr-6">
              Free, reliable home improvement and interior decor calculators. Plan room dimensions, paint quantities, hardwood flooring, lighting grids, and curtain fabrics with Imperial and Metric accuracy.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Calculations verified for architectural & design accuracy</span>
            </div>
          </div>

          {/* Calculator Categories Columns */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-100">
              Room & Materials
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/room-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Room Size
                </Link>
              </li>
              <li>
                <Link href="/calculators/square-footage-calculator" className="hover:text-emerald-400 transition-colors">
                  Square Footage
                </Link>
              </li>
              <li>
                <Link href="/calculators/wall-area-calculator" className="hover:text-emerald-400 transition-colors">
                  Wall Area
                </Link>
              </li>
              <li>
                <Link href="/calculators/paint-calculator" className="hover:text-emerald-400 transition-colors">
                  Paint Estimator
                </Link>
              </li>
              <li>
                <Link href="/calculators/wallpaper-calculator" className="hover:text-emerald-400 transition-colors">
                  Wallpaper Rolls
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-100">
              Floors & Finish
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/flooring-calculator" className="hover:text-emerald-400 transition-colors">
                  Flooring Boxes
                </Link>
              </li>
              <li>
                <Link href="/calculators/tile-calculator" className="hover:text-emerald-400 transition-colors">
                  Tile & Grout
                </Link>
              </li>
              <li>
                <Link href="/calculators/carpet-calculator" className="hover:text-emerald-400 transition-colors">
                  Carpet Rolls
                </Link>
              </li>
              <li>
                <Link href="/calculators/baseboard-calculator" className="hover:text-emerald-400 transition-colors">
                  Baseboards
                </Link>
              </li>
              <li>
                <Link href="/calculators/trim-calculator" className="hover:text-emerald-400 transition-colors">
                  Molding & Trim
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-100">
              Lighting & Decor
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/recessed-lighting-calculator" className="hover:text-emerald-400 transition-colors">
                  Recessed Lights
                </Link>
              </li>
              <li>
                <Link href="/calculators/chandelier-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Chandelier Size
                </Link>
              </li>
              <li>
                <Link href="/calculators/ceiling-fan-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Ceiling Fan Sizing
                </Link>
              </li>
              <li>
                <Link href="/calculators/rug-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Area Rug Size
                </Link>
              </li>
              <li>
                <Link href="/calculators/curtain-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Curtains & Drapes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-100">
              Living & Kitchen
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/wall-art-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Wall Art & Gallery
                </Link>
              </li>
              <li>
                <Link href="/calculators/bathroom-mirror-size-calculator" className="hover:text-emerald-400 transition-colors">
                  Bathroom Mirror
                </Link>
              </li>
              <li>
                <Link href="/calculators/tv-size-calculator" className="hover:text-emerald-400 transition-colors">
                  TV Size & Distance
                </Link>
              </li>
              <li>
                <Link href="/calculators/countertop-calculator" className="hover:text-emerald-400 transition-colors">
                  Countertop Slabs
                </Link>
              </li>
              <li>
                <Link href="/calculators/drywall-calculator" className="hover:text-emerald-400 transition-colors">
                  Drywall Sheets
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="py-8 border-b border-stone-800 text-xs text-stone-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-stone-300">Construction & Material Disclaimer:</strong> Calculations and material estimates provided by Home Space Calc are intended for general budgeting, spatial planning, and interior design assistance. Actual construction requirements may vary based on unique architectural conditions, structural framing, wall plumbness, contractor installation methods, and manufacturer package variances. Always field-verify measurements and consult licensed contractors or certified material suppliers prior to executing orders.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} Home Space Calc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-stone-200 transition-colors">
              About
            </Link>
            <Link href="/guides" className="hover:text-stone-200 transition-colors">
              Measurement Guides
            </Link>
            <Link href="/contact" className="hover:text-stone-200 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-stone-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-200 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
