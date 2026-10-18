'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateDrywall, DrywallResult } from '../../lib/calculators/drywall';
import UnitToggle from '../UnitToggle';
import { Box, CheckCircle2 } from 'lucide-react';

export default function DrywallCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(8);
  const [doorsCount, setDoorsCount] = useState<number>(1);
  const [windowsCount, setWindowsCount] = useState<number>(2);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [sheetType, setSheetType] = useState<'4x8' | '4x10' | '4x12' | 'metric_12x24' | 'metric_12x30'>('4x8');
  const [wastePercent, setWastePercent] = useState<number>(10);

  const roomLengthId = useId();
  const roomWidthId = useId();
  const wallHeightId = useId();
  const doorsCountId = useId();
  const windowsCountId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setWallHeight(prev => Number(feetToMeters(prev).toFixed(2)));
      setSheetType('metric_12x24');
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setWallHeight(prev => Number(metersToFeet(prev).toFixed(2)));
      setSheetType('4x8');
    }
    setUnit(newUnit);
  };

  let result: DrywallResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && wallHeight > 0) {
      result = calculateDrywall({
        roomLength,
        roomWidth,
        wallHeight,
        doorsCount,
        windowsCount,
        includeCeiling,
        sheetType,
        wastePercent,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room Framing</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room perimeter and sheet dimensions</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={roomLengthId} className="block text-xs font-semibold text-stone-700 mb-1">
                Room Length ({dimUnit})
              </label>
              <input
                id={roomLengthId}
                type="number"
                min="1"
                step="0.5"
                value={roomLength}
                onChange={e => setRoomLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label htmlFor={roomWidthId} className="block text-xs font-semibold text-stone-700 mb-1">
                Room Width ({dimUnit})
              </label>
              <input
                id={roomWidthId}
                type="number"
                min="1"
                step="0.5"
                value={roomWidth}
                onChange={e => setRoomWidth(parseFloat(e.target.value) || 0)}
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
                min="6"
                step="0.5"
                value={wallHeight}
                onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={doorsCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Doors Count
              </label>
              <input
                id={doorsCountId}
                type="number"
                min="0"
                value={doorsCount}
                onChange={e => setDoorsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label htmlFor={windowsCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Windows Count
              </label>
              <input
                id={windowsCountId}
                type="number"
                min="0"
                value={windowsCount}
                onChange={e => setWindowsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Drywall Sheet Size
              </label>
              <select
                value={sheetType}
                onChange={e => setSheetType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                {unit === 'imperial' ? (
                  <>
                    <option value="4x8">4 ft &times; 8 ft (32 sq ft - Standard)</option>
                    <option value="4x10">4 ft &times; 10 ft (40 sq ft - Tall walls)</option>
                    <option value="4x12">4 ft &times; 12 ft (48 sq ft - Fewer joints)</option>
                  </>
                ) : (
                  <>
                    <option value="metric_12x24">1.2 m &times; 2.4 m (2.88 m²)</option>
                    <option value="metric_12x30">1.2 m &times; 3.0 m (3.60 m²)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Waste Allowance
              </label>
              <select
                value={wastePercent}
                onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                <option value={10}>10% (Standard room)</option>
                <option value={15}>15% (Many cutouts / angles)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCeiling}
                onChange={e => setIncludeCeiling(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold text-stone-800">
                Include Ceiling Drywall Boarding
              </span>
            </label>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Drywall Materials Required</h2>
              <p className="text-xs text-stone-500 mt-0.5">Sheets and drywall finishing accessories</p>
            </div>
            <Box className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Sheets to Order
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.sheetsToBuy} Sheets
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Each sheet: {result.singleSheetArea} {areaUnit} ({result.sheetsToBuy * result.singleSheetArea} {areaUnit} total board)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Drywall Screws</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">
                    ~{result.screwsEstimateCount}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Joint Compound</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">
                    ~{result.jointCompoundGallons} {unit === 'imperial' ? 'gal' : 'liters'}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Joint Tape</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">
                    ~{result.tapeLengthNeeded} {dimUnit}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Gross Wall Area:</span>
                  <span className="font-semibold text-stone-900">{result.grossWallArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Deductions (Doors/Windows):</span>
                  <span>−{result.deductionsArea} {areaUnit}</span>
                </div>
                {result.ceilingArea > 0 && (
                  <div className="flex justify-between">
                    <span>Ceiling Area:</span>
                    <span className="font-semibold text-stone-900">+{result.ceilingArea} {areaUnit}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Coverage with {wastePercent}% Waste:</span>
                  <span>{result.totalAreaWithWaste} {areaUnit}</span>
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
