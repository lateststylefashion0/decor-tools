'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet } from '../../lib/conversions';
import { calculateRoomSize, RoomSizeResult, RoomSection } from '../../lib/calculators/roomSize';
import UnitToggle from '../UnitToggle';
import { Maximize, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function RoomSizeCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [sections, setSections] = useState<RoomSection[]>([
    { length: 15, width: 12, name: 'Main Area' },
  ]);
  const [roomHeight, setRoomHeight] = useState<number>(9);

  const roomHeightId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setSections(prev =>
        prev.map(s => ({
          ...s,
          length: Number(feetToMeters(s.length).toFixed(2)),
          width: Number(feetToMeters(s.width).toFixed(2)),
        }))
      );
      setRoomHeight(prev => (prev > 0 ? Number(feetToMeters(prev).toFixed(2)) : 0));
    } else {
      setSections(prev =>
        prev.map(s => ({
          ...s,
          length: Number(metersToFeet(s.length).toFixed(2)),
          width: Number(metersToFeet(s.width).toFixed(2)),
        }))
      );
      setRoomHeight(prev => (prev > 0 ? Number(metersToFeet(prev).toFixed(2)) : 0));
    }
    setUnit(newUnit);
  };

  const addSection = () => {
    const defaultLen = unit === 'imperial' ? 6 : 2;
    const defaultWid = unit === 'imperial' ? 4 : 1.5;
    setSections(prev => [
      ...prev,
      { length: defaultLen, width: defaultWid, name: `Section ${prev.length + 1}` },
    ]);
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSection = (idx: number, field: keyof RoomSection, val: any) => {
    setSections(prev =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  let result: RoomSizeResult | null = null;
  try {
    if (sections.length > 0 && sections.every(s => s.length > 0 && s.width > 0)) {
      result = calculateRoomSize({
        sections,
        roomHeight: roomHeight > 0 ? roomHeight : undefined,
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
              <h2 className="text-xl font-bold text-stone-900">Room Sections</h2>
              <p className="text-xs text-stone-500 mt-0.5">Measure rectangles, alcoves, or closets</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          {/* Sections List */}
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
                      min="0.1"
                      step="0.5"
                      value={sec.length}
                      onChange={e => updateSection(idx, 'length', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Width ({dimUnit})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={sec.width}
                      onChange={e => updateSection(idx, 'width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900"
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
              Add Room Section (Alcove / Closet / Nook)
            </button>
          </div>

          {/* Optional Ceiling Height */}
          <div className="pt-2 border-t border-stone-100">
            <label htmlFor={roomHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
              Ceiling Height ({dimUnit}) <span className="text-xs font-normal text-stone-400">(optional for volume)</span>
            </label>
            <input
              id={roomHeightId}
              type="number"
              min="0"
              step="0.5"
              value={roomHeight}
              onChange={e => setRoomHeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Total Room Measurements</h2>
              <p className="text-xs text-stone-500 mt-0.5">Area, perimeter, and cubic volume</p>
            </div>
            <Maximize className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Total Floor Area
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {unit === 'imperial' ? `${result.totalAreaSqFt} sq ft` : `${result.totalAreaSqM} m²`}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  {unit === 'imperial'
                    ? `${result.totalAreaSqM} m² (${result.totalAreaSqYd} sq yards)`
                    : `${result.totalAreaSqFt} sq ft (${result.totalAreaSqYd} sq yards)`}
                </p>
              </div>

              {/* Perimeter & Volume */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-xs text-stone-500">Perimeter</p>
                  <p className="text-xl font-bold text-stone-900 mt-0.5">
                    {unit === 'imperial' ? `${result.totalPerimeterFt} ft` : `${result.totalPerimeterM} m`}
                  </p>
                </div>
                {result.totalVolumeCuFt && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-xs text-stone-500">Cubic Volume</p>
                    <p className="text-xl font-bold text-stone-900 mt-0.5">
                      {unit === 'imperial' ? `${result.totalVolumeCuFt} cu ft` : `${result.totalVolumeCuM} m³`}
                    </p>
                  </div>
                )}
              </div>

              {/* Section Breakdown List */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <p className="font-bold text-stone-900 mb-1">Section Details:</p>
                {result.sectionDetails.map((sec, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{sec.name} ({sec.length}&times;{sec.width} {dimUnit}):</span>
                    <span className="font-semibold text-stone-900">
                      {sec.area} {unit === 'imperial' ? 'sq ft' : 'm²'}
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
