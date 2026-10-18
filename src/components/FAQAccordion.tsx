'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-stone-200/90 rounded-xl bg-white overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-stone-900 hover:text-emerald-800 transition-colors gap-4"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-emerald-700' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 text-stone-600 leading-relaxed text-[15px] border-t border-stone-100 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
