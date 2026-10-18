'use client';

import React, { useState } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateSquareFootage, SquareFootageResult, ShapeItem } from '../../lib/calculators/squareFootage';
import UnitToggle from '../UnitToggle';
import { Shapes, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ShapeInputItem {
  type: 'rectangle' | 'triangle' | 'circle' | 'deduction';
  dim1: number;
  dim2?: number;
  name: string;
}

export default function SquareFootageCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [shapes, setShapes] = useState<ShapeInputItem[]>([
    { type: 'rectangle', dim1: 20, dim2: 15, name: 'Main Living Room' },
    { type: 'triangle', dim1: 8, dim2: 4, name: 'Bay Window Nook' },
    { type: 'deduction', dim1: 10, dim2: 3.5, name: 'Stair Opening Cutout' },
  ]);

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setShapes(prev =>
        prev.map(s => ({
          ...s,
          dim1: Number(feetToMeters(s.dim1).toFixed(2)),
          dim2: s.dim2 ? Number(feetToMeters(s.dim2).toFixed(2)) : undefined,
        }))
      );
    } else {
      setShapes(prev =>
        prev.map(s => ({
          ...s,
          dim1: Number(metersToFeet(s.dim1).toFixed(2)),
          dim2: s.dim2 ? Number(metersToFeet(s.dim2).toFixed(2)) : undefined,
        }))
      );
    }
    setUnit(newUnit);
  };

  const addShape = (type: 'rectangle' | 'triangle' | 'circle' | 'deduction') => {
    const defaultD1 = unit === 'imperial' ? 10 : 3;
    const defaultD2 = unit === 'imperial' ? 8 : 2.5;
    const labels = {
      rectangle: 'Rectangular Room',
      triangle: 'Triangular Corner',
      circle: 'Circular Area',
      deduction: 'Deduction / Column',
    };
    setShapes(prev => [
      ...prev,
      {
        type,
        dim1: defaultD1,
        dim2: type === 'circle' ? undefined : defaultD2,
        name: `${labels[type]} ${prev.length + 1}`,
      },
    ]);
  };

  const removeShape = (idx: number) => {
    if (shapes.length <= 1) return;
    setShapes(prev => prev.filter((_, i) => i !== idx));
  };

  const updateShape = (idx: number, field: keyof ShapeInputItem, val: any) => {
    setShapes(prev =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  let result: SquareFootageResult | null = null;
  try {
    if (shapes.length > 0 && shapes.every(s => s.dim1 > 0 && (s.type === 'circle' || (s.dim2 && s.dim2 > 0)))) {
      result = calculateSquareFootage({ shapes, unit });
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
              <h2 className="text-xl font-bold text-stone-900">Geometric Sections</h2>
              <p className="text-xs text-stone-500 mt-0.5">Combine multiple shapes and subtract openings</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          {/* Shapes list */}
          <div className="space-y-3">
            {shapes.map((s, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-2 ${
                  s.type === 'deduction'
                    ? 'bg-red-50/40 border-red-200/80'
                    : 'bg-stone-50 border-stone-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        s.type === 'deduction'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.type}
                    </span>
                    <input
                      type="text"
                      value={s.name}
                      onChange={e => updateShape(idx, 'name', e.target.value)}
                      className="text-xs font-bold text-stone-800 bg-transparent border-none p-0 focus:ring-0"
                    />
                  </div>
                  {shapes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShape(idx)}
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
                      {s.type === 'circle' ? `Radius (${dimUnit})` : s.type === 'triangle' ? `Base (${dimUnit})` : `Length (${dimUnit})`}
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={s.dim1}
                      onChange={e => updateShape(idx, 'dim1', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900"
                    />
                  </div>
                  {s.type !== 'circle' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        {s.type === 'triangle' ? `Height (${dimUnit})` : `Width (${dimUnit})`}
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        value={s.dim2 || 0}
                        onChange={e => updateShape(idx, 'dim2', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Shape Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => addShape('rectangle')}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + Rectangle
              </button>
              <button
                type="button"
                onClick={() => addShape('triangle')}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + Triangle
              </button>
              <button
                type="button"
                onClick={() => addShape('circle')}
                className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> + Circle
              </button>
              <button
                type="button"
                onClick={() => addShape('deduction')}
                className="py-2 px-2.5 bg-red-50 hover:bg-red-100 text-red-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> − Deduction
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Total Net Area</h2>
              <p className="text-xs text-stone-500 mt-0.5">Multi-unit conversion outputs</p>
            </div>
            <Shapes className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Net Combined Area
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {unit === 'imperial'
                    ? `${result.netAreaSqFt} sq ft`
                    : `${result.netAreaSqM} m²`}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  {unit === 'imperial'
                    ? `${result.netAreaSqM} m² (${result.netAreaSqYards} sq yards)`
                    : `${result.netAreaSqFt} sq ft (${result.netAreaSqYards} sq yards)`}
                </p>
              </div>

              {/* Conversions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Square Feet</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">{result.netAreaSqFt}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Square Meters</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">{result.netAreaSqM}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="text-[11px] text-stone-500">Square Yards</p>
                  <p className="text-base font-bold text-stone-900 mt-0.5">{result.netAreaSqYards}</p>
                </div>
              </div>

              {result.netAreaAcres && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 rounded-xl">
                  <strong>Land Acreage Equivalent:</strong> {result.netAreaAcres} Acres
                </div>
              )}

              {/* Per-shape detailed breakdown */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <p className="font-bold text-stone-900 mb-1">Geometric Breakdown:</p>
                {result.shapeBreakdown.map((sb, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {sb.type === 'deduction' ? '− ' : '+ '}
                      {sb.name}:
                    </span>
                    <span className={`font-semibold ${sb.type === 'deduction' ? 'text-red-700' : 'text-stone-900'}`}>
                      {sb.area} {unit === 'imperial' ? 'sq ft' : 'm²'}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.summary}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
