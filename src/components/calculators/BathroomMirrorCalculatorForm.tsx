'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateBathroomMirror, BathroomMirrorResult } from '../../lib/calculators/bathroomMirror';
import UnitToggle from '../UnitToggle';
import { Square, CheckCircle2 } from 'lucide-react';

export default function BathroomMirrorCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [vanityWidth, setVanityWidth] = useState<number>(48);
  const [sinksCount, setSinksCount] = useState<1 | 2>(1);
  const [mirrorToVanityRatio, setMirrorToVanityRatio] = useState<number>(0.75);
  const [availableWallHeight, setAvailableWallHeight] = useState<number>(42);
  const [faucetClearance, setFaucetClearance] = useState<number>(5);
  const [lightClearance, setLightClearance] = useState<number>(4);

  const vanityWidthId = useId();
  const availableWallHeightId = useId();
  const faucetClearanceId = useId();
  const lightClearanceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setVanityWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setAvailableWallHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      setFaucetClearance(prev => Number(inchesToCm(prev).toFixed(1)));
      setLightClearance(prev => Number(inchesToCm(prev).toFixed(1)));
    } else {
      setVanityWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setAvailableWallHeight(prev => Number(cmToInches(prev).toFixed(1)));
      setFaucetClearance(prev => Number(cmToInches(prev).toFixed(1)));
      setLightClearance(prev => Number(cmToInches(prev).toFixed(1)));
    }
    setUnit(newUnit);
  };

  let result: BathroomMirrorResult | null = null;
  try {
    if (vanityWidth > 0 && availableWallHeight > 0) {
      result = calculateBathroomMirror({
        vanityWidth,
        sinksCount,
        mirrorToVanityRatio,
        availableWallHeight,
        faucetClearance,
        lightClearance,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'in' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Vanity Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter vanity cabinet width and available wall height</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={vanityWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Vanity Width ({dimUnit})
              </label>
              <input
                id={vanityWidthId}
                type="number"
                min="1"
                value={vanityWidth}
                onChange={e => setVanityWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={availableWallHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Available Wall Height ({dimUnit})
              </label>
              <input
                id={availableWallHeightId}
                type="number"
                min="1"
                value={availableWallHeight}
                onChange={e => setAvailableWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Number of Sinks
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSinksCount(1)}
                className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  sinksCount === 1
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Single Sink Vanity
              </button>
              <button
                type="button"
                onClick={() => setSinksCount(2)}
                className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                  sinksCount === 2
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Double Sink Vanity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={faucetClearanceId} className="block text-xs font-semibold text-stone-700 mb-1">
                Faucet Clearance ({dimUnit})
              </label>
              <input
                id={faucetClearanceId}
                type="number"
                min="1"
                value={faucetClearance}
                onChange={e => setFaucetClearance(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor={lightClearanceId} className="block text-xs font-semibold text-stone-700 mb-1">
                Light Fixture Clearance ({dimUnit})
              </label>
              <input
                id={lightClearanceId}
                type="number"
                min="1"
                value={lightClearance}
                onChange={e => setLightClearance(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Mirror Size</h2>
              <p className="text-xs text-stone-500 mt-0.5">Sizing and placement measurements</p>
            </div>
            <Square className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Single Full-Span Mirror
                </span>
                <p className="text-3xl font-extrabold text-stone-900 mt-2">
                  {result.singleMirrorWidth} &times; {result.singleMirrorHeight} {dimUnit}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Leaves balanced margins on either side of vanity
                </p>
              </div>

              {result.dualMirrorWidth && (
                <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Alternative: Dual Twin Mirrors
                  </span>
                  <p className="text-xl font-bold text-stone-900 mt-1">
                    2 &times; ({result.dualMirrorWidth} &times; {result.dualMirrorHeight} {dimUnit})
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Spaced {result.gapBetweenDualMirrors} {dimUnit} apart over each sink basin
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Hanging Height Above Countertop:</span>
                  <span className="font-semibold text-stone-900">
                    ~{result.recommendedHangingHeightAboveVanity} {dimUnit} above deck
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Average Eye-Level Center:</span>
                  <span className="font-semibold text-stone-900">
                    ~{result.recommendedCenterFromFloor} {dimUnit} from floor
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.guidance}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
