import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  customMessage?: string;
}

export default function DisclaimerBanner({ customMessage }: DisclaimerBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-amber-900 text-sm leading-relaxed">
      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-950">Important Renovation Notice</p>
        <p className="mt-0.5 text-amber-800/90">
          {customMessage ||
            'Calculations are mathematical estimates based on standard trade conventions. Always field-verify room measurements, examine packaging labels, and check with a licensed contractor before purchasing materials or starting installation.'}
        </p>
      </div>
    </div>
  );
}
