'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateCarpet, CarpetResult } from '../../lib/calculators/carpet';
import UnitToggle from '../UnitToggle';
import { SquareCode, CheckCircle2 } from 'lucide-react';

export default function CarpetCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(15);
  const [roomWidth, setRoomWidth] = useState<number>(11);
  const [rollWidth, setRollWidth] = useState<number>(12); // 12 ft standard roll
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [pricePerUnit, setPricePerUnit] = useState<number>(35); // $35/sq yd
  const [underlayPrice, setUnderlayPrice] = useState<number>(6); // $6/sq yd

  const roomLengthId = useId();
  const roomWidthId = useId();
  const rollWidthId = useId();
  const priceId = useId();
  const underlayPriceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setRollWidth(4.0); // 4.0 meters
      setPricePerUnit(prev => (prev > 0 ? Number((prev * 1.196).toFixed(2)) : 0));
      setUnderlayPrice(prev => (prev > 0 ? Number((prev * 1.196).toFixed(2)) : 0));
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setRollWidth(12); // 12 feet
      setPricePerUnit(prev => (prev > 0 ? Number((prev / 1.196).toFixed(2)) : 0));
      setUnderlayPrice(prev => (prev > 0 ? Number((prev / 1.196).toFixed(2)) : 0));
    }
    setUnit(newUnit);
  };

  let result: CarpetResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && rollWidth > 0) {
      result = calculateCarpet({
        roomLength,
        roomWidth,
        rollWidth,
        wastePercent,
        pricePerUnit: pricePerUnit > 0 ? pricePerUnit : undefined,
        underlayPricePerUnit: underlayPrice > 0 ? underlayPrice : undefined,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const billableUnit = unit === 'imperial' ? 'sq yd' : 'm²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room & Carpet Roll Setup</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room size and roll width</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={roomLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Length ({dimUnit})
              </label>
              <input
                id={roomLengthId}
                type="number"
                min="1"
                step="0.5"
                value={roomLength}
                onChange={e => setRoomLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={roomWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Width ({dimUnit})
              </label>
              <input
                id={roomWidthId}
                type="number"
                min="1"
                step="0.5"
                value={roomWidth}
                onChange={e => setRoomWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={rollWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Carpet Roll Width ({dimUnit})
              </label>
              <select
                id={rollWidthId}
                value={rollWidth}
                onChange={e => setRollWidth(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                {unit === 'imperial' ? (
                  <>
                    <option value={12}>12 Feet (Standard)</option>
                    <option value={15}>15 Feet (Seamless for large rooms)</option>
                  </>
                ) : (
                  <>
                    <option value={3.66}>3.66 Meters (12 ft)</option>
                    <option value={4.0}>4.0 Meters (Standard Euro)</option>
                    <option value={5.0}>5.0 Meters</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Waste Factor
              </label>
              <select
                value={wastePercent}
                onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                <option value={5}>5% (Exact width fit)</option>
                <option value={10}>10% (Standard seams & trim)</option>
                <option value={15}>15% (Irregular room / closet seams)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor={priceId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Carpet Price per {billableUnit} ($)
              </label>
              <input
                id={priceId}
                type="number"
                min="0"
                value={pricePerUnit}
                onChange={e => setPricePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label htmlFor={underlayPriceId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Padding/Underlay per {billableUnit} ($)
              </label>
              <input
                id={underlayPriceId}
                type="number"
                min="0"
                value={underlayPrice}
                onChange={e => setUnderlayPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Carpet Order Summary</h2>
              <p className="text-xs text-stone-500 mt-0.5">Square yards and linear roll requirements</p>
            </div>
            <SquareCode className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Total Carpet Needed
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {unit === 'imperial'
                    ? `${(result.carpetAreaWithWaste / 9).toFixed(1)} sq yd`
                    : `${result.carpetAreaWithWaste} m²`}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Linear cut length: ~{result.linearRollLengthNeeded} {dimUnit} of {rollWidth} {dimUnit} roll
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Room Net Floor Area:</span>
                  <span className="font-semibold text-stone-900">
                    {result.floorAreaSqFt} sq ft ({result.floorAreaSqYards} sq yd / {result.floorAreaSqM} m²)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Underlayment Cushion Needed:</span>
                  <span className="font-semibold text-stone-900">
                    {unit === 'imperial'
                      ? `${(result.underlayAreaNeeded / 9).toFixed(1)} sq yd`
                      : `${result.underlayAreaNeeded} m²`}
                  </span>
                </div>
                {result.totalEstimatedCost && (
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                    <span>Estimated Total Material Cost:</span>
                    <span>${result.totalEstimatedCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.installationAdvice}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
