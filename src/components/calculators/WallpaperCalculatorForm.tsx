'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateWallpaper, WallpaperResult } from '../../lib/calculators/wallpaper';
import UnitToggle from '../UnitToggle';
import { Scroll, CheckCircle2 } from 'lucide-react';

export default function WallpaperCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [wallWidth, setWallWidth] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(8);
  const [numberOfWalls, setNumberOfWalls] = useState<number>(4);
  const [rollWidth, setRollWidth] = useState<number>(20.5); // 20.5 inches standard
  const [rollLength, setRollLength] = useState<number>(33); // 33 ft standard
  const [patternRepeat, setPatternRepeat] = useState<number>(21); // 21 inches
  const [deductions, setDeductions] = useState<number>(36);

  const wallWidthId = useId();
  const wallHeightId = useId();
  const numberOfWallsId = useId();
  const rollWidthId = useId();
  const rollLengthId = useId();
  const patternRepeatId = useId();
  const deductionsId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setWallWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setWallHeight(prev => Number(feetToMeters(prev).toFixed(2)));
      setRollWidth(53); // 53 cm standard Euro roll
      setRollLength(10.05); // 10.05 m standard
      setPatternRepeat(prev => Number(inchesToCm(prev).toFixed(1)));
      setDeductions(prev => Number((prev * 0.0929).toFixed(1)));
    } else {
      setWallWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setWallHeight(prev => Number(metersToFeet(prev).toFixed(2)));
      setRollWidth(20.5); // 20.5 inches
      setRollLength(33); // 33 ft
      setPatternRepeat(prev => Number(cmToInches(prev).toFixed(1)));
      setDeductions(prev => Number((prev / 0.0929).toFixed(1)));
    }
    setUnit(newUnit);
  };

  let result: WallpaperResult | null = null;
  try {
    if (wallWidth > 0 && wallHeight > 0 && rollWidth > 0 && rollLength > 0) {
      result = calculateWallpaper({
        wallWidth,
        wallHeight,
        numberOfWalls,
        rollWidth,
        rollLength,
        patternRepeat,
        doorsWindowsDeduction: deductions > 0 ? deductions : 0,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const rollWidthUnit = unit === 'imperial' ? 'in' : 'cm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Wall & Roll Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter wall size and wallpaper repeat specs</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={wallWidthId} className="block text-xs font-semibold text-stone-700 mb-1">
                Wall Width ({dimUnit})
              </label>
              <input
                id={wallWidthId}
                type="number"
                min="1"
                step="0.5"
                value={wallWidth}
                onChange={e => setWallWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label htmlFor={wallHeightId} className="block text-xs font-semibold text-stone-700 mb-1">
                Wall Height ({dimUnit})
              </label>
              <input
                id={wallHeightId}
                type="number"
                min="1"
                step="0.5"
                value={wallHeight}
                onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label htmlFor={numberOfWallsId} className="block text-xs font-semibold text-stone-700 mb-1">
                Number of Walls
              </label>
              <input
                id={numberOfWallsId}
                type="number"
                min="1"
                max="10"
                value={numberOfWalls}
                onChange={e => setNumberOfWalls(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={rollWidthId} className="block text-xs font-semibold text-stone-700 mb-1">
                Roll Width ({rollWidthUnit})
              </label>
              <input
                id={rollWidthId}
                type="number"
                min="1"
                value={rollWidth}
                onChange={e => setRollWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor={rollLengthId} className="block text-xs font-semibold text-stone-700 mb-1">
                Roll Length ({dimUnit})
              </label>
              <input
                id={rollLengthId}
                type="number"
                min="1"
                value={rollLength}
                onChange={e => setRollLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor={patternRepeatId} className="block text-xs font-semibold text-stone-700 mb-1">
                Pattern Repeat ({rollWidthUnit})
              </label>
              <input
                id={patternRepeatId}
                type="number"
                min="0"
                value={patternRepeat}
                onChange={e => setPatternRepeat(parseFloat(e.target.value) || 0)}
                placeholder="0 for random"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor={deductionsId} className="block text-xs font-semibold text-stone-700 mb-1">
              Doors & Windows Deductions ({areaUnit}) <span className="text-[11px] font-normal text-stone-400">(optional)</span>
            </label>
            <input
              id={deductionsId}
              type="number"
              min="0"
              value={deductions}
              onChange={e => setDeductions(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Wallpaper Roll Estimate</h2>
              <p className="text-xs text-stone-500 mt-0.5">Calculated by drop geometry</p>
            </div>
            <Scroll className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Rolls to Purchase
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.rollsRequired} Rolls
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Yields {result.dropsPerRoll} vertical drops per roll
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Total Wall Area:</span>
                  <span className="font-semibold text-stone-900">{result.totalWallArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vertical Drops Required:</span>
                  <span className="font-semibold text-stone-900">{result.totalDropsRequired} strips</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Drop Cut Length:</span>
                  <span className="font-semibold text-stone-900">{result.effectiveDropLength} {dimUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Single Roll Area:</span>
                  <span className="font-semibold text-stone-900">{result.singleRollArea} {areaUnit}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.wasteExplanation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
