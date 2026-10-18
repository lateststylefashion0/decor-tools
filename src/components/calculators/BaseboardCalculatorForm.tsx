'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, inchesToCm, cmToInches } from '../../lib/conversions';
import { calculateBaseboard, BaseboardResult } from '../../lib/calculators/baseboard';
import UnitToggle from '../UnitToggle';
import { Maximize2, CheckCircle2 } from 'lucide-react';

export default function BaseboardCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(14);
  const [doorCount, setDoorCount] = useState<number>(2);
  const [doorWidth, setDoorWidth] = useState<number>(32); // 32 inches
  const [stockPieceLength, setStockPieceLength] = useState<number>(12); // 12 ft
  const [wastePercent, setWastePercent] = useState<number>(10);

  const roomLengthId = useId();
  const roomWidthId = useId();
  const doorCountId = useId();
  const doorWidthId = useId();
  const stockPieceLengthId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setDoorWidth(80); // 80 cm
      setStockPieceLength(3.6); // 3.6 meters
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setDoorWidth(32); // 32 inches
      setStockPieceLength(12); // 12 feet
    }
    setUnit(newUnit);
  };

  let result: BaseboardResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && stockPieceLength > 0) {
      result = calculateBaseboard({
        roomLength,
        roomWidth,
        doorCount,
        doorWidth,
        stockPieceLength,
        wastePercent,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const doorUnit = unit === 'imperial' ? 'in' : 'cm';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Perimeter & Door Openings</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room walls and doorway deductions</p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={roomLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Length ({dimUnit})
              </label>
              <input
                id={roomLengthId}
                type="number"
                min="1"
                step="0.5"
                value={roomLength}
                onChange={e => setRoomLength(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={roomWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Room Width ({dimUnit})
              </label>
              <input
                id={roomWidthId}
                type="number"
                min="1"
                step="0.5"
                value={roomWidth}
                onChange={e => setRoomWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={doorCountId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Doorways & Openings Count
              </label>
              <input
                id={doorCountId}
                type="number"
                min="0"
                value={doorCount}
                onChange={e => setDoorCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={doorWidthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Average Opening Width ({doorUnit})
              </label>
              <input
                id={doorWidthId}
                type="number"
                min="1"
                value={doorWidth}
                onChange={e => setDoorWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor={stockPieceLengthId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Stock Board Length ({dimUnit})
              </label>
              <select
                id={stockPieceLengthId}
                value={stockPieceLength}
                onChange={e => setStockPieceLength(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                {unit === 'imperial' ? (
                  <>
                    <option value={8}>8 Feet (Standard DIY)</option>
                    <option value={10}>10 Feet</option>
                    <option value={12}>12 Feet (Fewer seams)</option>
                    <option value={16}>16 Feet (Pro contractor)</option>
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
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value={10}>10% (Simple 4-corner room)</option>
                <option value={15}>15% (Many miter joints & corners)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Baseboard Order Summary</h2>
              <p className="text-xs text-stone-500 mt-0.5">Linear footage and stock piece count</p>
            </div>
            <Maximize2 className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Stock Boards to Buy
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.stockPiecesToBuy} Pieces
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Each {stockPieceLength} {dimUnit} long ({result.totalPurchasedLength} {dimUnit} total purchased)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Gross Room Perimeter:</span>
                  <span className="font-semibold text-stone-900">{result.grossPerimeter} {dimUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Deducted Doorways:</span>
                  <span>−{result.deductedOpeningsLength} {dimUnit}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Net Baseboard Length:</span>
                  <span>{result.netBaseboardLength} {dimUnit}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Length with {wastePercent}% Cutting Buffer:</span>
                  <span>{result.totalWithWasteLength} {dimUnit}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-500">
                  <span>Estimated Scrap / Cutoff Buffer:</span>
                  <span>{result.leftoverLength} {dimUnit}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.notes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
