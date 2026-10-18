'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateCeilingFan, CeilingFanResult } from '../../lib/calculators/ceilingFan';
import UnitToggle from '../UnitToggle';
import { Wind, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function CeilingFanCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(14);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [roomType, setRoomType] = useState<string>('bedroom');

  const roomLengthId = useId();
  const roomWidthId = useId();
  const ceilingHeightId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setCeilingHeight(prev => Number(feetToMeters(prev).toFixed(2)));
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setCeilingHeight(prev => Number(metersToFeet(prev).toFixed(2)));
    }
    setUnit(newUnit);
  };

  let result: CeilingFanResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && ceilingHeight > 0) {
      result = calculateCeilingFan({
        roomLength,
        roomWidth,
        ceilingHeight,
        roomType,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room measurements and ceiling height</p>
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
              <label htmlFor={ceilingHeightId} className="block text-xs font-semibold text-stone-700 mb-1">
                Ceiling Height ({dimUnit})
              </label>
              <input
                id={ceilingHeightId}
                type="number"
                min="6"
                step="0.5"
                value={ceilingHeight}
                onChange={e => setCeilingHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={e => setRoomType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            >
              <option value="bedroom">Bedroom</option>
              <option value="living">Living Room / Family Room</option>
              <option value="great_room">Great Room / Open Concept</option>
              <option value="patio">Covered Outdoor Patio</option>
            </select>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Fan Specifications</h2>
              <p className="text-xs text-stone-500 mt-0.5">Blade span and downrod sizing</p>
            </div>
            <Wind className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Recommended Blade Span
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.fanBladeSpanInches}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Metric equivalent: {result.fanBladeSpanCm} ({result.fansCount}{' '}
                  {result.fansCount === 1 ? 'fan recommended' : 'fans recommended'})
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Room Area:</span>
                  <span className="font-semibold text-stone-900">
                    {result.roomAreaSqFt} sq ft ({result.roomAreaSqM} m²)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mounting Configuration:</span>
                  <span className="font-semibold text-stone-900">{result.mountingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downrod Recommendation:</span>
                  <span className="font-semibold text-stone-900">
                    {result.downrodLengthRecommendation}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{result.bladeClearanceGuidance}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
