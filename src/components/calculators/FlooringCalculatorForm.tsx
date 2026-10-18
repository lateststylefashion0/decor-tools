'use client';

import React, { useState, useId } from 'react';
import { UnitSystem, feetToMeters, metersToFeet, sqFeetToSqMeters, sqMetersToSqFeet } from '../../lib/conversions';
import { calculateFlooring, FlooringResult } from '../../lib/calculators/flooring';
import UnitToggle from '../UnitToggle';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function FlooringCalculatorForm() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [roomLength, setRoomLength] = useState<number>(16);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [materialType, setMaterialType] = useState<'hardwood' | 'laminate' | 'vinyl' | 'engineered' | 'bamboo'>('vinyl');
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [packageCoverage, setPackageCoverage] = useState<number>(24);
  const [unitPrice, setUnitPrice] = useState<number>(3.5);

  const roomLengthId = useId();
  const roomWidthId = useId();
  const packageCoverageId = useId();
  const unitPriceId = useId();

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    if (newUnit === 'metric') {
      setRoomLength(prev => Number(feetToMeters(prev).toFixed(2)));
      setRoomWidth(prev => Number(feetToMeters(prev).toFixed(2)));
      setPackageCoverage(prev => Number(sqFeetToSqMeters(prev).toFixed(2)));
      setUnitPrice(prev => (prev > 0 ? Number((prev * 10.764).toFixed(2)) : 0));
    } else {
      setRoomLength(prev => Number(metersToFeet(prev).toFixed(2)));
      setRoomWidth(prev => Number(metersToFeet(prev).toFixed(2)));
      setPackageCoverage(prev => Number(sqMetersToSqFeet(prev).toFixed(2)));
      setUnitPrice(prev => (prev > 0 ? Number((prev / 10.764).toFixed(2)) : 0));
    }
    setUnit(newUnit);
  };

  let result: FlooringResult | null = null;
  try {
    if (roomLength > 0 && roomWidth > 0 && packageCoverage > 0) {
      result = calculateFlooring({
        roomLength,
        roomWidth,
        materialType,
        wastePercent,
        packageCoverage,
        unitPrice: unitPrice > 0 ? unitPrice : undefined,
        unit,
      });
    }
  } catch (err: any) {}

  const dimUnit = unit === 'imperial' ? 'ft' : 'm';
  const areaUnit = unit === 'imperial' ? 'sq ft' : 'm²';
  const currSym = '$';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Floor Dimensions</h2>
              <p className="text-xs text-stone-500 mt-0.5">Enter room measurements and box sizes</p>
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
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Material Type
              </label>
              <select
                value={materialType}
                onChange={e => setMaterialType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value="vinyl">Luxury Vinyl Plank (LVP)</option>
                <option value="laminate">Laminate Flooring</option>
                <option value="hardwood">Solid Hardwood</option>
                <option value="engineered">Engineered Wood</option>
                <option value="bamboo">Bamboo Planks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                Cutting Waste Margin
              </label>
              <select
                value={wastePercent}
                onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              >
                <option value={5}>5% (Simple rectangular room)</option>
                <option value={10}>10% (Standard residential cuts)</option>
                <option value={15}>15% (Diagonal, herringbone, many nooks)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor={packageCoverageId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Coverage per Box ({areaUnit})
              </label>
              <input
                id={packageCoverageId}
                type="number"
                min="1"
                step="0.1"
                value={packageCoverage}
                onChange={e => setPackageCoverage(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor={unitPriceId} className="block text-sm font-semibold text-stone-800 mb-1.5">
                Optional Price per {areaUnit} ({currSym})
              </label>
              <input
                id={unitPriceId}
                type="number"
                min="0"
                step="0.25"
                value={unitPrice}
                onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Flooring Order Summary</h2>
              <p className="text-xs text-stone-500 mt-0.5">Box count rounded upward for whole packages</p>
            </div>
            <Layers className="w-6 h-6 text-emerald-700" />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-stone-50 border-2 border-emerald-600/70">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Boxes to Order
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
                  {result.boxesRequired} Boxes
                </p>
                <p className="text-xs text-stone-600 mt-1">
                  Provides {result.totalBoxCoverage} {areaUnit} total coverage
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Net Floor Area:</span>
                  <span className="font-semibold text-stone-900">{result.floorArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Waste Allowance ({wastePercent}%):</span>
                  <span>+{result.wasteArea} {areaUnit}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Total Flooring Area Required:</span>
                  <span>{result.totalAreaToPurchase} {areaUnit}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-600">
                  <span>Estimated Leftover Buffer:</span>
                  <span>{result.leftoverArea} {areaUnit}</span>
                </div>
                {result.estimatedCost && (
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-stone-200">
                    <span>Estimated Total Material Cost:</span>
                    <span>${result.estimatedCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-stone-600 italic bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
