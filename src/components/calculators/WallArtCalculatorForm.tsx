'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateWallArtSize, WallArtResult } from '../../lib/calculators/wallArtSize';
import UnitToggle from '../UnitToggle';
import { CheckCircle2, Lightbulb, Image } from 'lucide-react';

export default function WallArtCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [wallWidth, setWallWidth] = useState<number>(120);
  const [wallHeight, setWallHeight] = useState<number>(96);
  const [furnitureWidth, setFurnitureWidth] = useState<number>(84);
  const [arrangement, setArrangement] = useState<'single' | 'two' | 'three' | 'gallery'>('two');
  const [proportion, setProportion] = useState<number>(0.67);

  const wallWidthId = useId();
  const wallHeightId = useId();
  const furnitureWidthId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setWallWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setWallHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      setFurnitureWidth(prev => (prev > 0 ? Number(inchesToCm(prev).toFixed(1)) : 0));
    } else {
      setWallWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setWallHeight(prev => Number(cmToInches(prev).toFixed(1)));
      setFurnitureWidth(prev => (prev > 0 ? Number(cmToInches(prev).toFixed(1)) : 0));
    }
    setUnit(newUnit);
  };

  let result: WallArtResult | null = null;
  try {
    if (wallWidth > 0 && wallHeight > 0) {
      result = calculateWallArtSize({
        wallWidth,
        wallHeight,
        furnitureWidth: furnitureWidth > 0 ? furnitureWidth : undefined,
        arrangement,
        proportion,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'in' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Wall & Furniture Space</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter wall and underlying furniture dimensions</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={wallWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Wall Width ({dimUnit})
              </label>
              <input
                id={wallWidthId}
                type="number"
                min="1"
                value={wallWidth}
                onChange={e => setWallWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={wallHeightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Wall Height ({dimUnit})
              </label>
              <input
                id={wallHeightId}
                type="number"
                min="1"
                value={wallHeight}
                onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor={furnitureWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
              Furniture Width Beneath Art ({dimUnit}) <span className="text-xs font-normal text-stone-400">(optional sofa, console, bed)</span>
            </label>
            <input
              id={furnitureWidthId}
              type="number"
              min="0"
              value={furnitureWidth}
              onChange={e => setFurnitureWidth(parseFloat(e.target.value) || 0)}
              placeholder="0 for standalone empty wall"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            />
          </div>

          {/* Arrangement Style */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-800">
              Artwork Arrangement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'single', label: 'Single Statement' },
                { id: 'two', label: 'Diptych (2 Pieces)' },
                { id: 'three', label: 'Triptych (3 Pieces)' },
                { id: 'gallery', label: 'Gallery Grid' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setArrangement(opt.id as any)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                    arrangement === opt.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Proportion slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-stone-800">
                Design Proportion Ratio
              </label>
              <span className="text-xs font-bold text-emerald-700">
                {Math.round(proportion * 100)}% of width
              </span>
            </div>
            <input
              type="range"
              min="0.55"
              max="0.75"
              step="0.01"
              value={proportion}
              onChange={e => setProportion(parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>55% (Subtle)</span>
              <span>67% (Interior Designer Golden 2/3)</span>
              <span>75% (Bold)</span>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Recommended Artwork Size</h2>
              <p className="text-xs text-stone-500 mt-0.5">Sizing and hanging height guide</p>
            </div>
            {result && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {result.pieceCount} {result.pieceCount === 1 ? 'Frame' : 'Frames'}
              </span>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Total Artwork Grouping
                </p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                  {result.totalArtworkWidth} &times; {result.totalArtworkHeight} {dimUnit}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Covers {result.coveragePercent}% of reference span
                </p>
              </div>

              {result.pieceCount > 1 && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Individual Frame Dimensions
                  </p>
                  <p className="text-lg font-bold text-stone-900">
                    {result.singlePieceWidth} &times; {result.singlePieceHeight} {dimUnit}{' '}
                    <span className="text-xs font-normal text-stone-500">
                      (each piece, spaced {result.spacingBetweenPieces} {dimUnit} apart)
                    </span>
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-2 text-stone-700">
                <div className="flex justify-between">
                  <span>Hanging Height Center:</span>
                  <span className="font-bold text-stone-900">
                    57–60 {dimUnit} from floor (Eye level museum standard)
                  </span>
                </div>
                {result.clearanceAboveFurniture && (
                  <div className="flex justify-between">
                    <span>Clearance Above Furniture:</span>
                    <span className="font-bold text-stone-900">
                      {result.clearanceAboveFurniture} {dimUnit} above top edge
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.recommendationNote}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
