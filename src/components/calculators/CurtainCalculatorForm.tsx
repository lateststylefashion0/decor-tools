'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateCurtainSize, CurtainResult } from '../../lib/calculators/curtainSize';
import UnitToggle from '../UnitToggle';
import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';

export default function CurtainCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [windowWidth, setWindowWidth] = useState<number>(60);
  const [windowHeight, setWindowHeight] = useState<number>(72);
  const [fullnessFactor, setFullnessFactor] = useState<number>(2.0);
  const [curtainStyle, setCurtainStyle] = useState<'eyelet' | 'pencil' | 'pinch'>('pencil');
  const [desiredLength, setDesiredLength] = useState<'sill' | 'below_sill' | 'floor'>('floor');
  const [rodOverhang, setRodOverhang] = useState<number>(6);
  const [rodHeightAbove, setRodHeightAbove] = useState<number>(6);
  const [panelCount, setPanelCount] = useState<number>(2);
  const [hemAllowance, setHemAllowance] = useState<number>(10);

  const windowWidthId = useId();
  const windowHeightId = useId();
  const rodOverhangId = useId();
  const rodHeightAboveId = useId();
  const panelCountId = useId();
  const hemAllowanceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      // inches to cm
      setWindowWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setWindowHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      setRodOverhang(prev => Number(inchesToCm(prev).toFixed(1)));
      setRodHeightAbove(prev => Number(inchesToCm(prev).toFixed(1)));
      setHemAllowance(prev => Number(inchesToCm(prev).toFixed(1)));
    } else {
      // cm to inches
      setWindowWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setWindowHeight(prev => Number(cmToInches(prev).toFixed(1)));
      setRodOverhang(prev => Number(cmToInches(prev).toFixed(1)));
      setRodHeightAbove(prev => Number(cmToInches(prev).toFixed(1)));
      setHemAllowance(prev => Number(cmToInches(prev).toFixed(1)));
    }
    setUnit(newUnit);
  };

  let result: CurtainResult | null = null;
  try {
    if (windowWidth > 0 && windowHeight > 0 && panelCount > 0) {
      result = calculateCurtainSize({
        windowWidth,
        windowHeight,
        fullnessFactor,
        curtainStyle,
        desiredLength,
        rodOverhang,
        rodHeightAbove,
        panelCount,
        hemAllowance,
        unit,
      });
    }
  } catch (err: any) {
    // handled gracefully
  }

  const dimUnit = unit === 'imperial' ? 'in' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Window & Rod Setup</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter window opening and hanging style</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={windowWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Window Width ({dimUnit})
              </label>
              <input
                id={windowWidthId}
                type="number"
                min="1"
                step="0.5"
                value={windowWidth}
                onChange={e => setWindowWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={windowHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Window Height ({dimUnit})
              </label>
              <input
                id={windowHeightId}
                type="number"
                min="1"
                step="0.5"
                value={windowHeight}
                onChange={e => setWindowHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          {/* Fullness & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Fullness Factor
              </label>
              <select
                value={fullnessFactor}
                onChange={e => setFullnessFactor(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value={1.5}>1.5× (Light / Minimal Gathering)</option>
                <option value={2.0}>2.0× (Standard Pleats - Recommended)</option>
                <option value={2.5}>2.5× (Luxurious / Heavy Drapery)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Curtain Heading Style
              </label>
              <select
                value={curtainStyle}
                onChange={e => setCurtainStyle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value="pencil">Pencil Pleat (Gathered)</option>
                <option value="eyelet">Eyelet / Grommet</option>
                <option value="pinch">Pinch Pleat (Tailored)</option>
              </select>
            </div>
          </div>

          {/* Drop Length Choice */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Desired Curtain Drop
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sill', 'below_sill', 'floor'] as const).map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setDesiredLength(style)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border capitalize transition-all ${
                    desiredLength === style
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {style === 'sill' ? 'To Sill' : style === 'below_sill' ? 'Below Sill' : 'To Floor'}
                </button>
              ))}
            </div>
          </div>

          {/* Allowances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label htmlFor={rodOverhangId} className="block text-xs font-medium text-stone-600 mb-1">
                Rod Overhang ({dimUnit})
              </label>
              <input
                id={rodOverhangId}
                type="number"
                min="0"
                value={rodOverhang}
                onChange={e => setRodOverhang(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900"
              />
            </div>
            <div>
              <label htmlFor={rodHeightAboveId} className="block text-xs font-medium text-stone-600 mb-1">
                Rod Height Above ({dimUnit})
              </label>
              <input
                id={rodHeightAboveId}
                type="number"
                min="0"
                value={rodHeightAbove}
                onChange={e => setRodHeightAbove(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900"
              />
            </div>
            <div>
              <label htmlFor={panelCountId} className="block text-xs font-medium text-stone-600 mb-1">
                Panel Count
              </label>
              <input
                id={panelCountId}
                type="number"
                min="1"
                max="8"
                value={panelCount}
                onChange={e => setPanelCount(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900"
              />
            </div>
            <div>
              <label htmlFor={hemAllowanceId} className="block text-xs font-medium text-stone-600 mb-1">
                Hem Allowance ({dimUnit})
              </label>
              <input
                id={hemAllowanceId}
                type="number"
                min="0"
                value={hemAllowance}
                onChange={e => setHemAllowance(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Curtain Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Fabric yardage and panel measurements</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {panelCount} Panels
            </span>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Single Panel Width
                  </p>
                  <p className="text-2xl font-black text-emerald-950 mt-1">
                    {result.singlePanelWidth} {dimUnit}
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Total fabric gathered: {result.totalFabricWidth} {dimUnit}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Finished Hanging Length
                  </p>
                  <p className="text-2xl font-black text-stone-900 mt-1">
                    {result.finishedCurtainLength} {dimUnit}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Cut length (with hems): {result.cutFabricLength} {dimUnit}
                  </p>
                </div>
              </div>

              {/* Total Fabric Yards / Meters */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-700">
                <div className="flex justify-between font-medium">
                  <span>Total Linear Fabric Needed:</span>
                  <span className="font-bold text-stone-900">
                    {result.fabricLengthYardsOrMeters} {unit === 'imperial' ? 'yards' : 'meters'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Track/Rod Width:</span>
                  <span className="font-semibold text-stone-900">
                    {result.totalRodWidth} {dimUnit}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Gathering Fullness Ratio:</span>
                  <span className="font-semibold text-stone-900">
                    {fullnessFactor}× ({curtainStyle} heading)
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
