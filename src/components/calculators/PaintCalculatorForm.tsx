'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculatePaint, PaintResult } from '../../lib/calculators/paint';
import UnitToggle from '../UnitToggle';
import { PaintBucket, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PaintCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [totalWallWidth, setTotalWallWidth] = useState<number>(48);
  const [wallHeight, setWallHeight] = useState<number>(9);
  const [doorsCount, setDoorsCount] = useState<number>(1);
  const [windowsCount, setWindowsCount] = useState<number>(2);
  const [coats, setCoats] = useState<number>(2);
  const [coveragePerUnit, setCoveragePerUnit] = useState<number>(350);
  const [containerSize, setContainerSize] = useState<number>(1);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [roomLength, setRoomLength] = useState<number>(12);
  const [roomWidth, setRoomWidth] = useState<number>(12);

  const wallWidthId = useId();
  const wallHeightId = useId();
  const doorsCountId = useId();
  const windowsCountId = useId();
  const coatsId = useId();
  const coveragePerUnitId = useId();
  const containerSizeId = useId();
  const ceilingLengthId = useId();
  const ceilingWidthId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setTotalWallWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setWallHeight(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setCoveragePerUnit(10);
      setContainerSize(1); // 1 Liter
    } else {
      setTotalWallWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setWallHeight(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setCoveragePerUnit(350);
      setContainerSize(1); // 1 Gallon
    }
    setUnit(newUnit);
  };

  let result: PaintResult | null = null;
  try {
    if (totalWallWidth > 0 && wallHeight > 0 && coats > 0 && coveragePerUnit > 0) {
      result = calculatePaint({
        totalWallWidth,
        wallHeight,
        doorsCount,
        windowsCount,
        coats,
        coveragePerUnit,
        includeCeiling,
        roomLength: includeCeiling ? roomLength : undefined,
        roomWidth: includeCeiling ? roomWidth : undefined,
        containerSize,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';
  const volUnit = unit === 'imperial' ? 'gallons' : 'liters';
  
  const getContainerLabel = () => {
    if (unit === 'imperial') {
      if (containerSize === 5) return '5-Gallon Buckets';
      if (containerSize === 0.25) return '1-Quart Cans';
      return '1-Gallon Cans';
    } else {
      if (containerSize === 2.5) return '2.5-Liter Cans';
      if (containerSize === 5) return '5-Liter Cans';
      if (containerSize === 10) return '10-Liter Buckets';
      return '1-Liter Cans';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Wall Measurements</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter wall dimensions and openings</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={wallWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Total Wall Width / Perimeter ({dimUnit})
              </label>
              <input
                id={wallWidthId}
                type="number"
                min="1"
                step="0.5"
                value={totalWallWidth}
                onChange={e => setTotalWallWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Sum of all walls to paint</span>
            </div>
            <div>
              <label htmlFor={wallHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Wall Height ({dimUnit})
              </label>
              <input
                id={wallHeightId}
                type="number"
                min="1"
                step="0.5"
                value={wallHeight}
                onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          {/* Doors & Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={doorsCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Doors Count <span className="text-xs font-normal text-stone-400">(-21 sq ft ea)</span>
              </label>
              <input
                id={doorsCountId}
                type="number"
                min="0"
                value={doorsCount}
                onChange={e => setDoorsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={windowsCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Windows Count <span className="text-xs font-normal text-stone-400">(-15 sq ft ea)</span>
              </label>
              <input
                id={windowsCountId}
                type="number"
                min="0"
                value={windowsCount}
                onChange={e => setWindowsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          {/* Coats and Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={coatsId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Number of Coats
              </label>
              <select
                id={coatsId}
                value={coats}
                onChange={e => setCoats(parseInt(e.target.value) || 2)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value={1}>1 Coat (Fresh Refresh / Same Color)</option>
                <option value={2}>2 Coats (Standard Recommendation)</option>
                <option value={3}>3 Coats (Drastic Color Change / Dark)</option>
              </select>
            </div>
            <div>
              <label htmlFor={coveragePerUnitId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Coverage per Unit ({unit === 'imperial' ? 'sq ft/gal' : 'm²/L'})
              </label>
              <input
                id={coveragePerUnitId}
                type="number"
                min="1"
                value={coveragePerUnit}
                onChange={e => setCoveragePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor={containerSizeId} className="block text-sm font-semibold text-stone-800 mb-1.5">
              Paint Container Size
            </label>
            <select
              id={containerSizeId}
              value={containerSize}
              onChange={e => setContainerSize(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            >
              {unit === 'imperial' ? (
                <>
                  <option value={1}>1-Gallon Can (Standard)</option>
                  <option value={5}>5-Gallon Bucket (Economical for whole rooms)</option>
                  <option value={0.25}>1-Quart Can (0.25 Gallon for small accents)</option>
                </>
              ) : (
                <>
                  <option value={1}>1-Liter Can (Standard)</option>
                  <option value={2.5}>2.5-Liter Can</option>
                  <option value={5}>5-Liter Can</option>
                  <option value={10}>10-Liter Bucket</option>
                </>
              )}
            </select>
          </div>

          {/* Ceiling Toggle */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCeiling}
                onChange={e => setIncludeCeiling(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-stone-800">
                Include Ceiling Painting
              </span>
            </label>

            {includeCeiling && (
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <label htmlFor={ceilingLengthId} className="block text-xs font-medium text-stone-600 mb-1">
                    Room Length ({dimUnit})
                  </label>
                  <input
                    id={ceilingLengthId}
                    type="number"
                    min="1"
                    value={roomLength}
                    onChange={e => setRoomLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={ceilingWidthId} className="block text-xs font-medium text-stone-600 mb-1">
                    Room Width ({dimUnit})
                  </label>
                  <input
                    id={ceilingWidthId}
                    type="number"
                    min="1"
                    value={roomWidth}
                    onChange={e => setRoomWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Estimated Paint Required</h2>
              <p className="text-xs text-stone-500 mt-0.5">Rounded up for full containers</p>
            </div>
            <PaintBucket className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              {/* Highlight Cans Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Containers to Purchase
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.cansToBuy} {getContainerLabel()}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Actual estimated paint volume: {result.gallonsOrLitersNeeded} {volUnit}
                </p>
              </div>

              {/* Area Breakdown Grid */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Gross Wall Area:</span>
                  <span className="font-semibold text-stone-900">{result.grossWallArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Deductions (Doors/Windows):</span>
                  <span>−{result.deductedArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Paintable Wall Area:</span>
                  <span className="font-semibold text-stone-900">{result.netWallArea} {areaUnit}</span>
                </div>
                {result.ceilingArea > 0 && (
                  <div className="flex justify-between">
                    <span>Ceiling Area:</span>
                    <span className="font-semibold text-stone-900">+{result.ceilingArea} {areaUnit}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-200 font-bold text-stone-900">
                  <span>Total Coverage Area ({coats} coats):</span>
                  <span>{result.totalCoatArea} {areaUnit}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Primer Recommendation:</strong> For raw unpainted drywall or high-contrast color transitions, purchase ~{Math.ceil(result.primerEstimate)} {volUnit} of dedicated primer sealer for a primer coat.
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
