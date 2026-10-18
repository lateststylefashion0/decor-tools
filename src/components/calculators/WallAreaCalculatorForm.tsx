'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateWallArea, WallAreaResult, WallSegment } from '../../lib/calculators/wallArea';
import UnitToggle from '../UnitToggle';
import { SquareDashedBottom, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function WallAreaCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [walls, setWalls] = useState<WallSegment[]>([
    { width: 14, height: 9, name: 'Wall 1' },
    { width: 12, height: 9, name: 'Wall 2' },
    { width: 14, height: 9, name: 'Wall 3' },
    { width: 12, height: 9, name: 'Wall 4' },
  ]);
  const [doorsCount, setDoorsCount] = useState<number>(1);
  const [doorWidth, setDoorWidth] = useState<number>(36);
  const [doorHeight, setDoorHeight] = useState<number>(80);
  const [windowsCount, setWindowsCount] = useState<number>(2);
  const [windowWidth, setWindowWidth] = useState<number>(36);
  const [windowHeight, setWindowHeight] = useState<number>(48);

  const doorsCountId = useId();
  const windowsCountId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setWalls(prev =>
        prev.map(w => ({
          ...w,
          width: Number(feetToMeters(w.width).toFixed(2)),
          height: Number(feetToMeters(w.height).toFixed(2)),
        }))
      );
      setDoorWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setDoorHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      setWindowWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setWindowHeight(prev => Number(inchesToCm(prev).toFixed(1)));
    } else {
      setWalls(prev =>
        prev.map(w => ({
          ...w,
          width: Number(metersToFeet(w.width).toFixed(2)),
          height: Number(metersToFeet(w.height).toFixed(2)),
        }))
      );
      setDoorWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setDoorHeight(prev => Number(cmToInches(prev).toFixed(1)));
      setWindowWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setWindowHeight(prev => Number(cmToInches(prev).toFixed(1)));
    }
    setUnit(newUnit);
  };

  const addWall = () => {
    const defaultW = unit === 'imperial' ? 12 : 3.5;
    const defaultH = unit === 'imperial' ? 9 : 2.7;
    setWalls(prev => [
      ...prev,
      { width: defaultW, height: defaultH, name: `Wall ${prev.length + 1}` },
    ]);
  };

  const removeWall = (idx: number) => {
    if (walls.length <= 1) return;
    setWalls(prev => prev.filter((_, i) => i !== idx));
  };

  const updateWall = (idx: number, field: keyof WallSegment, val: any) => {
    setWalls(prev =>
      prev.map((w, i) => (i === idx ? { ...w, [field]: val } : w))
    );
  };

  let result: WallAreaResult | null = null;
  try {
    if (walls.length > 0 && walls.every(w => w.width > 0 && w.height > 0)) {
      result = calculateWallArea({
        walls,
        doorsCount,
        doorWidthInOrCm: doorWidth,
        doorHeightInOrCm: doorHeight,
        windowsCount,
        windowWidthInOrCm: windowWidth,
        windowHeightInOrCm: windowHeight,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const openDimUnit = unit === 'imperial' ? 'in' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Individual Walls</h2>
              <p className="text-xs text-stone-500 mt-0.5">Add or remove wall partitions</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          {/* Walls List */}
          <div className="space-y-3">
            {walls.map((wall, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={wall.name || `Wall ${idx + 1}`}
                    onChange={e => updateWall(idx, 'name', e.target.value)}
                    className="text-xs font-bold text-stone-800 bg-transparent border-none p-0 focus:ring-0"
                  />
                  {walls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWall(idx)}
                      className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove wall"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Width ({dimUnit})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={wall.width}
                      onChange={e => updateWall(idx, 'width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Height ({dimUnit})
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={wall.height}
                      onChange={e => updateWall(idx, 'height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addWall}
              className="w-full py-2.5 px-4 border border-dashed border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Another Wall Partition
            </button>
          </div>

          {/* Openings */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <h3 className="text-sm font-bold text-stone-800">Door & Window Deductions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={doorsCountId} className="block text-xs font-semibold text-stone-700 mb-1">
                  Doors Count
                </label>
                <input
                  id={doorsCountId}
                  type="number"
                  min="0"
                  value={doorsCount}
                  onChange={e => setDoorsCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label htmlFor={windowsCountId} className="block text-xs font-semibold text-stone-700 mb-1">
                  Windows Count
                </label>
                <input
                  id={windowsCountId}
                  type="number"
                  min="0"
                  value={windowsCount}
                  onChange={e => setWindowsCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Net Wall Area Summary</h2>
              <p className="text-xs text-stone-500 mt-0.5">Square footage and metric meters</p>
            </div>
            <SquareDashedBottom className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Net Paintable / Tiling Area
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {unit === 'imperial'
                    ? `${result.netWallAreaSqFt} sq ft`
                    : `${result.netWallAreaSqM} m²`}
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  {unit === 'imperial'
                    ? `${result.netWallAreaSqM} m² metric equivalent`
                    : `${result.netWallAreaSqFt} sq ft imperial equivalent`}
                </p>
              </div>

              {/* Breakdown stats */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Gross Combined Wall Area:</span>
                  <span className="font-semibold text-stone-900">
                    {unit === 'imperial' ? `${result.grossWallAreaSqFt} sq ft` : `${result.grossWallAreaSqM} m²`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Openings Deducted:</span>
                  <span>
                    −{unit === 'imperial' ? `${result.openingsAreaSqFt} sq ft` : `${result.openingsAreaSqM} m²`}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200">
                  <span>Estimated Paint Needed (2 coats):</span>
                  <span className="font-bold text-stone-900">~{result.estimatedPaintGallons} Gallons</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Wallpaper Rolls:</span>
                  <span className="font-bold text-stone-900">~{result.estimatedWallpaperRolls} Rolls</span>
                </div>
              </div>

              {/* Per-wall individual breakdown */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1.5">
                <p className="font-bold text-stone-900 mb-1">Per-Wall Gross Dimensions:</p>
                {result.wallBreakdown.map((wb, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{wb.name} ({wb.width}&times;{wb.height} {dimUnit}):</span>
                    <span className="font-semibold text-stone-900">
                      {wb.area} {unit === 'imperial' ? 'sq ft' : 'm²'}
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
