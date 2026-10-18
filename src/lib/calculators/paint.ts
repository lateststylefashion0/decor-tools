import { UnitSystem, ceilPurchasable } from '../conversions';

export interface PaintInput {
  totalWallWidth: number; // ft or m
  wallHeight: number; // ft or m
  doorsCount: number;
  windowsCount: number;
  coats: number; // default 2
  coveragePerUnit: number; // sq ft per gallon (default 350) or sq m per liter (default 10)
  includeCeiling: boolean;
  roomLength?: number; // for ceiling
  roomWidth?: number; // for ceiling
  containerSize?: number; // capacity per container (e.g. 1 gal, 5 gal, 0.25 gal, 1L, 2.5L, 5L)
  unit: UnitSystem;
}

export interface PaintResult {
  grossWallArea: number;
  deductedArea: number;
  netWallArea: number;
  ceilingArea: number;
  totalNetArea: number;
  totalCoatArea: number;
  gallonsOrLitersNeeded: number;
  containerCapacity: number;
  cansToBuy: number;
  primerEstimate: number;
  notes: string;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const {
    totalWallWidth,
    wallHeight,
    doorsCount,
    windowsCount,
    coats,
    coveragePerUnit,
    includeCeiling,
    roomLength,
    roomWidth,
    containerSize = 1,
    unit,
  } = input;

  if (totalWallWidth <= 0 || wallHeight <= 0) {
    throw new Error('Wall width and height must be greater than zero.');
  }
  if (coats <= 0) {
    throw new Error('Number of coats must be at least 1.');
  }
  if (coveragePerUnit <= 0) {
    throw new Error('Coverage per unit must be greater than zero.');
  }
  const validContainerSize = containerSize > 0 ? containerSize : 1;

  // Standard deductions
  // Door: ~21 sq ft (1.95 sq m)
  // Window: ~15 sq ft (1.39 sq m)
  const doorArea = unit === 'imperial' ? 21 : 1.95;
  const windowArea = unit === 'imperial' ? 15 : 1.39;

  const grossWallArea = totalWallWidth * wallHeight;
  const deductedArea = Math.min(grossWallArea * 0.8, (doorsCount * doorArea) + (windowsCount * windowArea));
  const netWallArea = Math.max(0, grossWallArea - deductedArea);

  let ceilingArea = 0;
  if (includeCeiling && roomLength && roomWidth && roomLength > 0 && roomWidth > 0) {
    ceilingArea = roomLength * roomWidth;
  }

  const totalNetArea = netWallArea + ceilingArea;
  const totalCoatArea = totalNetArea * coats;

  const unitsNeeded = totalCoatArea / coveragePerUnit;
  const cansToBuy = ceilPurchasable(unitsNeeded / validContainerSize);

  // Primer estimate: 1 coat over raw or patched surface
  const primerUnits = totalNetArea / coveragePerUnit;

  const notes = `Calculated with ${coats} coats at ${coveragePerUnit} ${unit === 'imperial' ? 'sq ft/gal' : 'sq m/L'}. Textured walls, unprimed drywall, or dramatic color shifts may require up to 15% more paint.`;

  return {
    grossWallArea: Number(grossWallArea.toFixed(2)),
    deductedArea: Number(deductedArea.toFixed(2)),
    netWallArea: Number(netWallArea.toFixed(2)),
    ceilingArea: Number(ceilingArea.toFixed(2)),
    totalNetArea: Number(totalNetArea.toFixed(2)),
    totalCoatArea: Number(totalCoatArea.toFixed(2)),
    gallonsOrLitersNeeded: Number(unitsNeeded.toFixed(2)),
    containerCapacity: validContainerSize,
    cansToBuy,
    primerEstimate: Number(primerUnits.toFixed(2)),
    notes,
  };
}
