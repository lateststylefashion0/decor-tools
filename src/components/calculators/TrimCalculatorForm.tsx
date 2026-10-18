'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateTrim, TrimResult } from '../../lib/calculators/trim';
import UnitToggle from '../UnitToggle';
import { Sliders, CheckCircle2 } from 'lucide-react';

export default function TrimCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [trimType, setTrimType] = useState<'door_casing' | 'window_casing' | 'crown_molding' | 'chair_rail'>('door_casing');
  const [width, setWidth] = useState<number>(36); // 36 inches for door, or 50 ft for crown
  const [height, setHeight] = useState<number>(80); // 80 inches for door
  const [openingCount, setOpeningCount] = useState<number>(3);
  const [stockPieceLength, setStockPieceLength] = useState<number>(8); // 8 ft
  const [wastePercent, setWastePercent] = useState<number>(10);

  const widthId = useId();
  const heightId = useId();
  const openingCountId = useId();
  const stockPieceLengthId = useId();

  const isPerimeterType = trimType === 'crown_molding' || trimType === 'chair_rail';

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      if (isPerimeterType) {
        setWidth(prev => Number((prev * 0.3048).toFixed(2))); // ft to m
      } else {
        setWidth(prev => Number(inchesToCm(prev).toFixed(1)));
        setHeight(prev => Number(inchesToCm(prev).toFixed(1)));
      }
      setStockPieceLength(2.4); // 2.4 meters
    } else {
      if (isPerimeterType) {
        setWidth(prev => Number((prev / 0.3048).toFixed(2))); // m to ft
      } else {
        setWidth(prev => Number(cmToInches(prev).toFixed(1)));
        setHeight(prev => Number(cmToInches(prev).toFixed(1)));
      }
      setStockPieceLength(8); // 8 feet
    }
    setUnit(newUnit);
  };

  let result: TrimResult | null = null;
  try {
    if (width > 0 && stockPieceLength > 0) {
      result = calculateTrim({
        trimType,
        width,
        height: isPerimeterType ? undefined : height,
        openingCount: isPerimeterType ? undefined : openingCount,
        stockPieceLength,
        wastePercent,
        unit,
      });
    }
  } catch (err: any) {}

  const openDimUnit = unit === 'imperial' ? 'in' : 'cm';
  const linearUnit = unit === 'imperial' ? 'ft' : 'm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Trim & Molding Type</h2>
              <p className="text-xs text-stone-500 mt-0.5">Select casing or architectural profile</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-1.5">
              Architectural Trim Style
            </label>
            <select
              value={trimType}
              onChange={e => {
                const nextType = e.target.value as any;
                setTrimType(nextType);
                if (nextType === 'crown_molding' || nextType === 'chair_rail') {
                  setWidth(unit === 'imperial' ? 52 : 16);
                } else if (nextType === 'door_casing') {
                  setWidth(unit === 'imperial' ? 36 : 90);
                  setHeight(unit === 'imperial' ? 80 : 200);
                } else if (nextType === 'window_casing') {
                  setWidth(unit === 'imperial' ? 36 : 90);
                  setHeight(unit === 'imperial' ? 48 : 120);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
            >
              <option value="door_casing">Door Casing (3-sided trim)</option>
              <option value="window_casing">Window Casing (4-sided frame)</option>
              <option value="crown_molding">Crown Molding (Ceiling perimeter)</option>
              <option value="chair_rail">Chair Rail / Wainscot Cap</option>
            </select>
          </div>

          {!isPerimeterType ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={widthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Opening Width ({openDimUnit})
                  </label>
                  <input
                    id={widthId}
                    type="number"
                    min="1"
                    value={width}
                    onChange={e => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label htmlFor={heightId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Opening Height ({openDimUnit})
                  </label>
                  <input
                    id={heightId}
                    type="number"
                    min="1"
                    value={height}
                    onChange={e => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor={openingCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                  Number of Openings
                </label>
                <input
                  id={openingCountId}
                  type="number"
                  min="1"
                  max="50"
                  value={openingCount}
                  onChange={e => setOpeningCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor={widthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Total Room Wall Perimeter ({linearUnit})
              </label>
              <input
                id={widthId}
                type="number"
                min="1"
                value={width}
                onChange={e => setWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor={stockPieceLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Stock Board Length ({linearUnit})
              </label>
              <select
                id={stockPieceLengthId}
                value={stockPieceLength}
                onChange={e => setStockPieceLength(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                {unit === 'imperial' ? (
                  <>
                    <option value={8}>8 Feet</option>
                    <option value={10}>10 Feet</option>
                    <option value={12}>12 Feet</option>
                    <option value={16}>16 Feet</option>
                  </>
                ) : (
                  <>
                    <option value={2.4}>2.4 Meters</option>
                    <option value={3.0}>3.0 Meters</option>
                    <option value={3.6}>3.6 Meters</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Waste Factor
              </label>
              <select
                value={wastePercent}
                onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm"
              >
                <option value={10}>10% (Standard flat casing)</option>
                <option value={15}>15% (Crown molding miters)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Molding Material Estimate</h2>
              <p className="text-xs text-stone-500 mt-0.5">Linear footage and stock piece count</p>
            </div>
            <Sliders className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Stock Boards to Buy
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.stockPiecesRequired} Pieces
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Each {stockPieceLength} {linearUnit} long ({result.totalPurchasedLength} {linearUnit} total)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Net Linear Length Required:</span>
                  <span className="font-semibold text-stone-900">{result.totalLinearLengthNeeded} {linearUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total with {wastePercent}% Waste Margin:</span>
                  <span className="font-semibold text-stone-900">{result.totalWithWaste} {linearUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Estimated Scrap Offcut:</span>
                  <span>{result.leftoverLength} {linearUnit}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.cuttingGuidance}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
