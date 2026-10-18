'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateRugSize, RugSizeResult } from '../../lib/calculators/rugSize';
import UnitToggle from '../UnitToggle';
import { CheckCircle2, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';

export default function RugCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [arrangement, setArrangement] = useState<'all' | 'front' | 'center'>('front');
  const [error, setError] = useState<string | null>(null);

  const roomLengthId = useId();
  const roomWidthId = useId();

  // Unit conversion handler: converts existing values rather than merely changing labels
  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      // Convert feet to meters
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
    } else {
      // Convert meters to feet
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
    }
    setUnit(newUnit);
  };

  // Perform calculation
  let result: RugSizeResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0) {
      result = calculateRugSize({ roomLength, roomWidth, arrangement, unit });
    }
  } catch (err: any) {
    // handled gracefully
  }

  const handleReset = () => {
    setUnit('imperial');
    setRoomLength(14);
    setRoomWidth(12);
    setArrangement('front');
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter your room measurements</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          {/* Room Dimensions Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={roomLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Length ({unit === 'imperial' ? 'ft' : 'm'})
              </label>
              <div className="relative">
                <input
                  id={roomLengthId}
                  type="number"
                  min="1"
                  max="100"
                  step="0.1"
                  value={roomLength}
                  onChange={e => setRoomLength(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white transition-colors"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-stone-400">
                  {unit === 'imperial' ? 'ft' : 'm'}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor={roomWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Width ({unit === 'imperial' ? 'ft' : 'm'})
              </label>
              <div className="relative">
                <input
                  id={roomWidthId}
                  type="number"
                  min="1"
                  max="100"
                  step="0.1"
                  value={roomWidth}
                  onChange={e => setRoomWidth(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white transition-colors"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-stone-400">
                  {unit === 'imperial' ? 'ft' : 'm'}
                </span>
              </div>
            </div>
          </div>

          {/* Rug Placement Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-800">
              Rug Placement & Furniture Style
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  arrangement === 'front'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="arrangement"
                  value="front"
                  checked={arrangement === 'front'}
                  onChange={() => setArrangement('front')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-semibold text-sm">Front Legs Only (Most Popular)</span>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Front legs of sofas and armchairs rest on the rug. Anchors conversational seating while opening walkways.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  arrangement === 'all'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="arrangement"
                  value="all"
                  checked={arrangement === 'all'}
                  onChange={() => setArrangement('all')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-semibold text-sm">Entire Room (All Furniture on Rug)</span>
                  <p className="text-xs text-stone-500 mt-0.5">
                    All seating legs sit entirely on the rug. Leaves 12–18&quot; border from room walls for a luxurious look.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  arrangement === 'center'
                    ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="arrangement"
                  value="center"
                  checked={arrangement === 'center'}
                  onChange={() => setArrangement('center')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-semibold text-sm">Center Only (Under Coffee Table)</span>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Smaller accent rug centered under coffee table. Perfect for compact rooms or high-traffic pathways.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline"
            >
              Reset to Defaults
            </button>
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Calculates live
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Rug Sizes</h2>
              <p className="text-xs text-stone-500 mt-0.5">Standard trade sizes closest to your space</p>
            </div>
            {result && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {result.coveragePercent}% Floor Coverage
              </span>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              {/* Best Fit Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/60 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 px-2.5 py-0.5 rounded-full">
                        Best Fit
                      </span>
                      <span className="text-xs font-medium text-stone-500">Standard Size</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                      {unit === 'imperial' ? result.bestFit.nameImperial : result.bestFit.nameMetric}
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {result.bestFit.widthIn}&quot; × {result.bestFit.lengthIn}&quot; (
                      {unit === 'imperial'
                        ? `${result.bestFit.areaSqFt} sq ft`
                        : `${result.bestFit.areaSqM.toFixed(1)} m²`}
                      )
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                </div>
              </div>

              {/* Secondary Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.largerOption && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Larger Alternative
                    </p>
                    <p className="text-lg font-bold text-stone-900 mt-1">
                      {unit === 'imperial'
                        ? result.largerOption.nameImperial
                        : result.largerOption.nameMetric}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Leaves tighter floor margins for grand spaces
                    </p>
                  </div>
                )}

                {result.smallerOption && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Smaller Alternative
                    </p>
                    <p className="text-lg font-bold text-stone-900 mt-1">
                      {unit === 'imperial'
                        ? result.smallerOption.nameImperial
                        : result.smallerOption.nameMetric}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Leaves wider perimeter for walkways
                    </p>
                  </div>
                )}
              </div>

              {/* Metric Breakdown */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>Room Gross Area:</span>
                  <span className="font-semibold text-stone-900">
                    {result.roomArea} {unit === 'imperial' ? 'sq ft' : 'm²'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target Dimensions:</span>
                  <span className="font-semibold text-stone-900">
                    ~{result.recommendedWidth} × {result.recommendedLength}{' '}
                    {unit === 'imperial' ? 'ft' : 'm'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Floor Coverage Ratio:</span>
                  <span className="font-semibold text-stone-900">
                    {result.coveragePercent}%
                  </span>
                </div>
              </div>

              {/* Recommendation Note */}
              <p className="text-xs text-stone-600 leading-relaxed italic bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                {result.guidelineNotes}
              </p>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-400">
              Please enter valid room length and width to view recommendations.
            </div>
          )}
        </div>
      </div>

      {/* Visual Examples Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-stone-900">Visual Layout Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-32 bg-stone-100 rounded-xl flex items-center justify-center p-2">
              <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
                <rect x="5" y="5" width="150" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="15" y="15" width="130" height="70" rx="3" fill="#dfd7cb" stroke="#8c7860" strokeWidth="1.5" />
                <rect x="25" y="22" width="110" height="20" rx="3" fill="#64748b" />
                <rect x="55" y="50" width="50" height="20" rx="3" fill="#92400e" />
              </svg>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Entire Room (All Legs On)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              All furniture legs rest on the rug. Best for open-concept floor plans and expansive living areas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-32 bg-stone-100 rounded-xl flex items-center justify-center p-2">
              <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
                <rect x="5" y="5" width="150" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="25" y="28" width="110" height="55" rx="3" fill="#dfd7cb" stroke="#8c7860" strokeWidth="1.5" />
                <rect x="20" y="15" width="120" height="20" rx="3" fill="#64748b" />
                <rect x="55" y="44" width="50" height="20" rx="3" fill="#92400e" />
              </svg>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Front Legs Only (Designer Standard)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sofa and chairs have only their front feet on the rug, grounding the seating arrangement cleanly.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="h-32 bg-stone-100 rounded-xl flex items-center justify-center p-2">
              <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
                <rect x="5" y="5" width="150" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="45" y="40" width="70" height="40" rx="3" fill="#dfd7cb" stroke="#8c7860" strokeWidth="1.5" />
                <rect x="20" y="15" width="120" height="20" rx="3" fill="#64748b" />
                <rect x="55" y="50" width="50" height="20" rx="3" fill="#92400e" />
              </svg>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Center Only (Coffee Table)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Rug sits solely under the central coffee table. Ideal for small apartments or decorative statement rugs.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Tips Box */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 text-emerald-950 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
          <Lightbulb className="w-5 h-5 text-emerald-700" />
          Tips for Choosing the Right Rug Size
        </div>
        <ul className="list-disc list-inside text-sm text-emerald-900/90 space-y-1.5 pl-1 leading-relaxed">
          <li>For living rooms, a larger rug that extends under furniture almost always looks better than a small postage-stamp rug.</li>
          <li>In bedrooms, the rug should extend 2 to 3 feet beyond the sides and foot of the bed.</li>
          <li>For dining rooms, ensure the rug is large enough for chairs to remain fully on the rug even when pulled back for seating.</li>
          <li>Leave 12 to 18 inches of exposed flooring between the rug edge and the wall in medium-to-large rooms.</li>
        </ul>
      </div>
    </div>
  );
}
