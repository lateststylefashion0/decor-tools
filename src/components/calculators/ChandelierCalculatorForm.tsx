'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateChandelier, ChandelierResult } from '../../lib/calculators/chandelier';
import UnitToggle from '../UnitToggle';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function ChandelierCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(14);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [diningTableWidth, setDiningTableWidth] = useState<number>(40);

  const roomLengthId = useId();
  const roomWidthId = useId();
  const ceilingHeightId = useId();
  const diningTableWidthId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setCeilingHeight(prev => Number(feetToMeters(prev).toFixed(2)));
      setDiningTableWidth(prev => (prev > 0 ? Number(inchesToCm(prev).toFixed(1)) : 0));
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setCeilingHeight(prev => Number(metersToFeet(prev).toFixed(2)));
      setDiningTableWidth(prev => (prev > 0 ? Number(cmToInches(prev).toFixed(1)) : 0));
    }
    setUnit(newUnit);
  };

  let result: ChandelierResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && ceilingHeight > 0) {
      result = calculateChandelier({
        roomLength,
        roomWidth,
        ceilingHeight,
        diningTableWidth: diningTableWidth > 0 ? diningTableWidth : undefined,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const diamUnit = unit === 'imperial' ? 'inches' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Room & Table Setup</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room measurements and table dimensions</p>
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
            <label htmlFor={diningTableWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
              Dining Table Width ({unit === 'imperial' ? 'in' : 'cm'}) <span className="text-xs font-normal text-stone-400">(optional)</span>
            </label>
            <input
              id={diningTableWidthId}
              type="number"
              min="0"
              value={diningTableWidth}
              onChange={e => setDiningTableWidth(parseFloat(e.target.value) || 0)}
              placeholder="0 if hanging in open room or foyer"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Chandelier Sizing</h2>
              <p className="text-xs text-stone-500 mt-0.5">Golden ratio interior sizing</p>
            </div>
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Chandelier Diameter / Width
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {unit === 'imperial'
                    ? `${result.roomChandelierDiameterInches} inches`
                    : `${result.roomChandelierDiameterCm} cm`}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Ideal fixture body height: {unit === 'imperial'
                    ? `${result.chandelierHeightMinInches}" – ${result.chandelierHeightMaxInches}" tall`
                    : `${result.chandelierHeightMinCm} – ${result.chandelierHeightMaxCm} cm tall`}
                </p>
              </div>

              {result.tableChandelierDiameterInches && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Dining Table Sizing:
                  </span>
                  <p className="text-xl font-bold text-stone-900 mt-1">
                    {unit === 'imperial'
                      ? `${result.tableChandelierDiameterInches} inches diameter`
                      : `${result.tableChandelierDiameterCm} cm diameter`}
                  </p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {result.hangingHeightAboveTable}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Open Floor Hanging Clearance:</span>
                  <span className="font-semibold text-stone-900">{result.hangingHeightOpenFloor}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.designRuleExplanation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
