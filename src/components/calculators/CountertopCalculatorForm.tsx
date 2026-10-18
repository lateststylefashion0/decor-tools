'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateCountertop, CountertopResult, CountertopSection } from '../../lib/calculators/countertop';
import UnitToggle from '../UnitToggle';
import { Layers, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function CountertopCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [sections, setSections] = useState<CountertopSection[]>([
    { length: 120, depth: 25.5, name: 'Main Run' },
    { length: 72, depth: 36, name: 'Kitchen Island' },
  ]);
  const [backsplashHeight, setBacksplashHeight] = useState<number>(4);
  const [sinkCutoutsCount, setSinkCutoutsCount] = useState<number>(1);
  const [cooktopCutoutsCount, setCooktopCutoutsCount] = useState<number>(0);
  const [materialThickness, setMaterialThickness] = useState<'2cm' | '3cm'>('3cm');
  const [pricePerUnit, setPricePerUnit] = useState<number>(75);

  const backsplashHeightId = useId();
  const sinkCutoutsId = useId();
  const cooktopCutoutsId = useId();
  const priceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setSections(prev =>
        prev.map(s => ({
          ...s,
          length: Number(inchesToCm(s.length).toFixed(1)),
          depth: Number(inchesToCm(s.depth).toFixed(1)),
        }))
      );
      setBacksplashHeight(prev => (prev > 0 ? Number(inchesToCm(prev).toFixed(1)) : 0));
      setPricePerUnit(prev => (prev > 0 ? Number((prev * 10.764).toFixed(2)) : 0));
    } else {
      setSections(prev =>
        prev.map(s => ({
          ...s,
          length: Number(cmToInches(s.length).toFixed(1)),
          depth: Number(cmToInches(s.depth).toFixed(1)),
        }))
      );
      setBacksplashHeight(prev => (prev > 0 ? Number(cmToInches(prev).toFixed(1)) : 0));
      setPricePerUnit(prev => (prev > 0 ? Number((prev / 10.764).toFixed(2)) : 0));
    }
    setUnit(newUnit);
  };

  const addSection = () => {
    const defaultLen = unit === 'imperial' ? 60 : 150;
    const defaultDep = unit === 'imperial' ? 25.5 : 65;
    setSections(prev => [
      ...prev,
      { length: defaultLen, depth: defaultDep, name: `Section ${prev.length + 1}` },
    ]);
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSection = (idx: number, field: keyof CountertopSection, val: any) => {
    setSections(prev =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  let result: CountertopResult | null = null;
  try {
    if (sections.length > 0 && sections.every(s => s.length > 0 && s.depth > 0)) {
      result = calculateCountertop({
        sections,
        backsplashHeight,
        sinkCutoutsCount,
        cooktopCutoutsCount,
        materialThickness,
        pricePerUnitArea: pricePerUnit > 0 ? pricePerUnit : undefined,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'in' : 'cm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Countertop Layout</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter countertop sections and slab options</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={sec.name || `Section ${idx + 1}`}
                    onChange={e => updateSection(idx, 'name', e.target.value)}
                    className="text-xs font-bold text-stone-800 bg-transparent border-none p-0 focus:ring-0"
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Length ({dimUnit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={sec.length}
                      onChange={e => updateSection(idx, 'length', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Depth ({dimUnit})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={sec.depth}
                      onChange={e => updateSection(idx, 'depth', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="w-full py-2.5 px-4 border border-dashed border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Countertop Section (Island / Bar / L-Return)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={backsplashHeightId} className="block text-xs font-semibold text-stone-700 mb-1">
                Backsplash Height ({dimUnit})
              </label>
              <input
                id={backsplashHeightId}
                type="number"
                min="0"
                value={backsplashHeight}
                onChange={e => setBacksplashHeight(parseFloat(e.target.value) || 0)}
                placeholder="0 for none"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor={sinkCutoutsId} className="block text-xs font-semibold text-stone-700 mb-1">
                Sink Openings
              </label>
              <input
                id={sinkCutoutsId}
                type="number"
                min="0"
                value={sinkCutoutsCount}
                onChange={e => setSinkCutoutsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label htmlFor={cooktopCutoutsId} className="block text-xs font-semibold text-stone-700 mb-1">
                Cooktop Cutouts
              </label>
              <input
                id={cooktopCutoutsId}
                type="number"
                min="0"
                value={cooktopCutoutsCount}
                onChange={e => setCooktopCutoutsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Thickness
              </label>
              <select
                value={materialThickness}
                onChange={e => setMaterialThickness(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                <option value="3cm">3 cm (~1.25 in - Standard Kitchen)</option>
                <option value="2cm">2 cm (~0.75 in - Vanity / Laminated)</option>
              </select>
            </div>
            <div>
              <label htmlFor={priceId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Price per {areaUnit} ($)
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
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Countertop Estimate</h2>
              <p className="text-xs text-stone-500 mt-0.5">Net square footage and slab requirements</p>
            </div>
            <Layers className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Estimated Jumbo Slabs
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.estimatedFabricationSlabs} {result.estimatedFabricationSlabs === 1 ? 'Slab' : 'Slabs'}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Accounting for vein matching & seam layout ({result.totalSlabAreaProvided} {areaUnit} gross material)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Gross Countertop Surface:</span>
                  <span className="font-semibold text-stone-900">{result.grossSurfaceArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Cutout Openings (Sink & Cooktop):</span>
                  <span>−{result.cutoutArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Backsplash Area:</span>
                  <span className="font-semibold text-stone-900">+{result.backsplashArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>Total Finished Net Area:</span>
                  <span>{result.totalFinishedArea} {areaUnit}</span>
                </div>
                {result.estimatedCost && (
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                    <span>Estimated Material Cost:</span>
                    <span>${result.estimatedCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{result.fabricationNotice}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
