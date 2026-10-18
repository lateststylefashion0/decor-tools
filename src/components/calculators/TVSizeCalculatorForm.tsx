'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateTVSize, TVSizeResult } from '../../lib/calculators/tvSize';
import UnitToggle from '../UnitToggle';
import { Tv, CheckCircle2, XCircle } from 'lucide-react';

export default function TVSizeCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [wallWidth, setWallWidth] = useState<number>(96);
  const [wallHeight, setWallHeight] = useState<number>(96);
  const [viewingDistance, setViewingDistance] = useState<number>(9);
  const [viewingAngle, setViewingAngle] = useState<'cinema' | 'mixed' | 'smpte'>('cinema');

  const wallWidthId = useId();
  const wallHeightId = useId();
  const viewingDistanceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setWallWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setWallHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      setViewingDistance(prev => Number(feetToMeters(prev).toFixed(2)));
    } else {
      setWallWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setWallHeight(prev => Number(cmToInches(prev).toFixed(1)));
      setViewingDistance(prev => Number(metersToFeet(prev).toFixed(2)));
    }
    setUnit(newUnit);
  };

  let result: TVSizeResult | null = null;
  try {
    if (wallWidth > 0 && wallHeight > 0 && viewingDistance > 0) {
      result = calculateTVSize({
        wallWidth,
        wallHeight,
        viewingDistance,
        viewingAnglePreference: viewingAngle,
        unit,
      });
    }
  } catch (err: any) {}

  const wallDimUnit = unit === 'imperial' ? 'in' : 'cm';
  const distUnit = unit === 'imperial' ? 'ft' : 'm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Seating & Wall Space</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter distance from couch to TV wall</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div>
            <label htmlFor={viewingDistanceId} className="block text-sm font-semibold text-stone-800 mb-1.5">
              Viewing Distance ({distUnit})
            </label>
            <input
              id={viewingDistanceId}
              type="number"
              min="3"
              step="0.5"
              value={viewingDistance}
              onChange={e => setViewingDistance(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={wallWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Available Wall Width ({wallDimUnit})
              </label>
              <input
                id={wallWidthId}
                type="number"
                min="20"
                value={wallWidth}
                onChange={e => setWallWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={wallHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Available Wall Height ({wallDimUnit})
              </label>
              <input
                id={wallHeightId}
                type="number"
                min="20"
                value={wallHeight}
                onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Viewing Field-of-View Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cinema', label: 'Cinema 40°', sub: 'THX Immersion' },
                { id: 'mixed', label: 'Balanced 36°', sub: 'Movies & TV' },
                { id: 'smpte', label: 'Standard 30°', sub: 'SMPTE Everyday' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setViewingAngle(opt.id as any)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                    viewingAngle === opt.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className={`text-[10px] ${viewingAngle === opt.id ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {opt.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Screen Size</h2>
              <p className="text-xs text-stone-500 mt-0.5">Pythagorean 16:9 display dimensions</p>
            </div>
            <Tv className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Ideal Screen Diagonal
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.recommendedDiagonalIdeal}&quot; Diagonal
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Comfortable viewing range: {result.recommendedDiagonalMin}&quot; to {result.recommendedDiagonalMax}&quot;
                </p>
              </div>

              {/* 16:9 Screen dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500">Screen Width (16:9)</p>
                  <p className="text-lg font-bold text-stone-900 mt-0.5">
                    {unit === 'imperial'
                      ? `${result.idealScreenWidthInches}"`
                      : `${result.idealScreenWidthCm} cm`}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500">Screen Height (16:9)</p>
                  <p className="text-lg font-bold text-stone-900 mt-0.5">
                    {unit === 'imperial'
                      ? `${result.idealScreenHeightInches}"`
                      : `${result.idealScreenHeightCm} cm`}
                  </p>
                </div>
              </div>

              {/* Commercial Sizes Fitting Available Wall */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <p className="font-bold text-stone-900">Standard Retail TV Sizes on Your Wall:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {result.fittingCommercialSizes.map(item => (
                    <div
                      key={item.diagonal}
                      className={`p-2 rounded-lg border text-center ${
                        item.fitsWall
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-red-50/50 border-red-200 text-red-700 opacity-60'
                      }`}
                    >
                      <span className="font-bold">{item.diagonal}&quot;</span>
                      <div className="text-[10px] mt-0.5">
                        {item.fitsWall ? '✓ Fits wall' : '✗ Exceeds wall'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-950">
                <strong>Ergonomic Mounting Height:</strong> {result.recommendedMountingCenterHeight}.
              </div>

              <p className="text-xs text-stone-600 italic leading-relaxed">
                {result.viewingDistanceGuidance}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
