'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateRecessedLighting, RecessedLightingResult } from '../../lib/calculators/recessedLighting';
import UnitToggle from '../UnitToggle';
import { Sun, CheckCircle2 } from 'lucide-react';

export default function RecessedLightingCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [spacingMethod, setSpacingMethod] = useState<'ceiling_rule' | 'target_lumens'>('ceiling_rule');
  const [targetIlluminationFc, setTargetIlluminationFc] = useState<number>(25);
  const [fixtureLumens, setFixtureLumens] = useState<number>(750);

  const roomLengthId = useId();
  const roomWidthId = useId();
  const ceilingHeightId = useId();
  const targetIllumId = useId();
  const fixtureLumensId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setCeilingHeight(prev => Number(feetToMeters(prev).toFixed(2)));
      setTargetIlluminationFc(250); // 250 lux
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setCeilingHeight(prev => Number(metersToFeet(prev).toFixed(2)));
      setTargetIlluminationFc(25); // 25 fc
    }
    setUnit(newUnit);
  };

  let result: RecessedLightingResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && ceilingHeight > 0 && fixtureLumens > 0) {
      result = calculateRecessedLighting({
        roomLength,
        roomWidth,
        ceilingHeight,
        spacingMethod,
        targetIlluminationFc,
        fixtureLumens,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const illumUnit = unit === 'imperial' ? 'fc (Foot-Candles)' : 'lux';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room & Ceiling Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room measurements and lighting goals</p>
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

          {/* Spacing Method */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Planning Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSpacingMethod('ceiling_rule')}
                className={`p-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                  spacingMethod === 'ceiling_rule'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold">Ceiling Height Rule</div>
                <div className={`text-[11px] mt-0.5 ${spacingMethod === 'ceiling_rule' ? 'text-emerald-100' : 'text-stone-500'}`}>
                  Space cans ~Ceiling Height &divide; 2
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSpacingMethod('target_lumens')}
                className={`p-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                  spacingMethod === 'target_lumens'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold">Target Illumination</div>
                <div className={`text-[11px] mt-0.5 ${spacingMethod === 'target_lumens' ? 'text-emerald-100' : 'text-stone-500'}`}>
                  Calculate from lux / foot-candles
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={fixtureLumensId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Fixture Lumens (LED)
              </label>
              <select
                id={fixtureLumensId}
                value={fixtureLumens}
                onChange={e => setFixtureLumens(parseInt(e.target.value) || 750)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value={600}>600 Lumens (Soft ambient / 4&quot; trim)</option>
                <option value={750}>750 Lumens (Standard 4&quot; or 6&quot; can)</option>
                <option value={900}>900 Lumens (Bright task / high ceiling)</option>
                <option value={1100}>1,100 Lumens (Commercial / ultra bright)</option>
              </select>
            </div>

            <div>
              <label htmlFor={targetIllumId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Target Illumination ({illumUnit})
              </label>
              <input
                id={targetIllumId}
                type="number"
                min="5"
                value={targetIlluminationFc}
                onChange={e => setTargetIlluminationFc(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Lighting Grid</h2>
              <p className="text-xs text-stone-500 mt-0.5">Balanced ceiling can placement</p>
            </div>
            <Sun className="w-6 h-6 text-amber-500" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Total Fixtures Needed
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.recommendedCount} Downlights
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Arranged in a {result.gridRows} &times; {result.gridCols} ceiling grid
                </p>
              </div>

              {/* Spacing Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500">Spacing Between Fixtures</p>
                  <p className="text-lg font-bold text-stone-900 mt-0.5">
                    ~{result.spacingBetweenFixtures} {dimUnit}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500">Distance From Wall</p>
                  <p className="text-lg font-bold text-stone-900 mt-0.5">
                    ~{result.spacingFromWall} {dimUnit}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Room Area:</span>
                  <span className="font-semibold text-stone-900">{result.roomArea} {unit === 'imperial' ? 'sq ft' : 'm²'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Lumen Output:</span>
                  <span className="font-semibold text-stone-900">{result.totalLumensDelivered.toLocaleString()} lumens</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivered Illumination:</span>
                  <span className="font-semibold text-stone-900">~{result.estimatedIllumination} {illumUnit}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.layoutExplanation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
