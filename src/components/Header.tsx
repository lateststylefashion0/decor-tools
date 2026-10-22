'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Search, Menu, X, Compass, Info, Mail, Calculator } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Home className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Home Space <span className="text-emerald-700">Calc</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-stone-700">
            <Link
              href="/"
              className="hover:text-emerald-700 transition-colors py-1"
            >
              Home
            </Link>
            <Link
              href="/calculators"
              className="hover:text-emerald-700 transition-colors py-1"
            >
              Calculators
            </Link>
            <Link
              href="/guides"
              className="hover:text-emerald-700 transition-colors py-1"
            >
              Guides
            </Link>
            <Link
              href="/about"
              className="hover:text-emerald-700 transition-colors py-1"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-700 transition-colors py-1"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/calculators"
              aria-label="Search calculators"
              className="p-2.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
          >
            <Home className="w-5 h-5 text-emerald-600" />
            Home
          </Link>
          <Link
            href="/calculators"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
          >
            <Calculator className="w-5 h-5 text-emerald-600" />
            All 20 Calculators
          </Link>
          <Link
            href="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
          >
            <Compass className="w-5 h-5 text-emerald-600" />
            Guides & Tips
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
          >
            <Info className="w-5 h-5 text-emerald-600" />
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-800 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
          >
            <Mail className="w-5 h-5 text-emerald-600" />
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
