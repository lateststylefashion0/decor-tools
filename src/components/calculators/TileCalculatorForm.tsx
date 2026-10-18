'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateTiles, TileResult } from '../../lib/calculators/tile';
import UnitToggle from '../UnitToggle';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';

export default function TileCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [surfaceLength, setSurfaceLength] = useState<number>(10);
  const [surfaceWidth, setSurfaceWidth] = useState<number>(8);
  const [tileLength, setTileLength] = useState<number>(12);
  const [tileWidth, setTileWidth] = useState<number>(24);
  const [groutSpacing, setGroutSpacing] = useState<number>(0.125); // 1/8 in
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [tilesPerBox, setTilesPerBox] = useState<number>(8);

  const surfaceLengthId = useId();
  const surfaceWidthId = useId();
  const tileLengthId = useId();
  const tileWidthId = useId();
  const groutSpacingId = useId();
  const tilesPerBoxId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setSurfaceLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setSurfaceWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setTileLength(prev => Number(inchesToCm(prev).toFixed(1)));
      setTileWidth(prev => Number(inchesToCm(prev).toFixed(1)));
      setGroutSpacing(3); // 3mm standard grout
    } else {
      setSurfaceLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setSurfaceWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setTileLength(prev => Number(cmToInches(prev).toFixed(1)));
      setTileWidth(prev => Number(cmToInches(prev).toFixed(1)));
      setGroutSpacing(0.125); // 1/8 inch
    }
    setUnit(newUnit);
  };

  let result: TileResult | null = null;
  try {
    if (surfaceLength > 0 && surfaceWidth > 0 && tileLength > 0 && tileWidth > 0 && tilesPerBox > 0) {
      result = calculateTiles({
        surfaceLength,
        surfaceWidth,
        tileLength,
        tileWidth,
        groutSpacing,
        wastePercent,
        tilesPerBox,
        unit,
      });
    }
  } catch (err: any) {}

  const surfDimUnit = unit === 'imperial' ? 'ft' : 'm';
  const tileDimUnit = unit === 'imperial' ? 'in' : 'cm';
  const groutUnit = unit === 'imperial' ? 'in' : 'mm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Surface & Tile Sizing</h2>
              <p className="text-xs text-stone-500 mt-0.5">Floor, wall, or backsplash dimensions</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={surfaceLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Surface Length ({surfDimUnit})
              </label>
              <input
                id={surfaceLengthId}
                type="number"
                min="1"
                step="0.5"
                value={surfaceLength}
                onChange={e => setSurfaceLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={surfaceWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Surface Width ({surfDimUnit})
              </label>
              <input
                id={surfaceWidthId}
                type="number"
                min="1"
                step="0.5"
                value={surfaceWidth}
                onChange={e => setSurfaceWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={tileLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Tile Length ({tileDimUnit})
              </label>
              <input
                id={tileLengthId}
                type="number"
                min="0.5"
                value={tileLength}
                onChange={e => setTileLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={tileWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Tile Width ({tileDimUnit})
              </label>
              <input
                id={tileWidthId}
                type="number"
                min="0.5"
                value={tileWidth}
                onChange={e => setTileWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={groutSpacingId} className="block text-xs font-semibold text-stone-700 mb-1">
                Grout Width ({groutUnit})
              </label>
              <input
                id={groutSpacingId}
                type="number"
                min="0"
                step="0.03"
                value={groutSpacing}
                onChange={e => setGroutSpacing(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Waste Factor
              </label>
              <select
                value={wastePercent}
                onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              >
                <option value={10}>10% (Straight Grid)</option>
                <option value={15}>15% (Diagonal / Brick)</option>
                <option value={20}>20% (Herringbone)</option>
              </select>
            </div>
            <div>
              <label htmlFor={tilesPerBoxId} className="block text-xs font-semibold text-stone-700 mb-1">
                Tiles per Box
              </label>
              <input
                id={tilesPerBoxId}
                type="number"
                min="1"
                value={tilesPerBox}
                onChange={e => setTilesPerBox(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Tile Calculation Results</h2>
              <p className="text-xs text-stone-500 mt-0.5">Estimated tile count and boxes needed</p>
            </div>
            <LayoutGrid className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-600/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Boxes to Buy
                  </span>
                  <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
                    {result.boxesRequired} Boxes
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    ({result.boxesRequired * tilesPerBox} total tiles)
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Total Tiles Needed
                  </span>
                  <p className="text-3xl font-extrabold text-stone-900 mt-1">
                    {result.totalTilesNeeded}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {result.netTilesNeeded} net + {result.wasteTiles} waste
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Total Surface Area:</span>
                  <span className="font-semibold text-stone-900">{result.surfaceArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Purchased Boxes Total Coverage:</span>
                  <span className="font-semibold text-stone-900">{result.totalCoveragePurchased} {areaUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leftover Spare Tiles Buffer:</span>
                  <span className="font-semibold text-stone-900">{result.leftoverTiles} tiles</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.guidance}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
