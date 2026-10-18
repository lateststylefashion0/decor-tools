import { UnitSystem, ceilPurchasable } from '../conversions';

export interface DrywallInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  wallHeight: number; // ft or m
  doorsCount: number;
  windowsCount: number;
  includeCeiling: boolean;
  sheetType: '4x8' | '4x10' | '4x12' | 'metric_12x24' | 'metric_12x30';
  wastePercent: number; // 10, 15
  unit: UnitSystem;
}

export interface DrywallResult {
  grossWallArea: number;
  deductionsArea: number;
  netWallArea: number;
  ceilingArea: number;
  totalBoardAreaNeeded: number;
  totalAreaWithWaste: number;
  singleSheetArea: number;
  sheetsToBuy: number;
  screwsEstimateCount: number;
  jointCompoundGallons: number;
  tapeLengthNeeded: number;
  guidance: string;
}

export function calculateDrywall(input: DrywallInput): DrywallResult {
  const {
    roomLength,
    roomWidth,
    wallHeight,
    doorsCount,
    windowsCount,
    includeCeiling,
    sheetType,
    wastePercent,
    unit,
  } = input;

  if (roomLength <= 0 || roomWidth <= 0 || wallHeight <= 0) {
    throw new Error('Room dimensions and wall height must be greater than zero.');
  }

  const perimeter = 2 * (roomLength + roomWidth);
  const grossWallArea = perimeter * wallHeight;

  const doorDeduction = unit === 'imperial' ? 21 : 1.95;
  const windowDeduction = unit === 'imperial' ? 15 : 1.39;
  const deductionsArea = Math.min(grossWallArea * 0.7, (doorsCount * doorDeduction) + (windowsCount * windowDeduction));
  const netWallArea = Math.max(0, grossWallArea - deductionsArea);

  const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
  const totalBoardAreaNeeded = netWallArea + ceilingArea;
  const totalAreaWithWaste = totalBoardAreaNeeded * (1 + wastePercent / 100);

  // Sheet sizes
  let sheetArea = 32; // default 4x8 ft
  if (unit === 'imperial') {
    if (sheetType === '4x10') sheetArea = 40;
    else if (sheetType === '4x12') sheetArea = 48;
    else sheetArea = 32; // 4x8
  } else {
    if (sheetType === 'metric_12x30') sheetArea = 3.60; // 1200x3000 mm
    else if (sheetType === 'metric_12x24') sheetArea = 2.88; // 1200x2400 mm
    else sheetArea = 2.88;
  }

  const sheetsToBuy = ceilPurchasable(totalAreaWithWaste / sheetArea);

  // Fasteners & finishing supplies
  // ~32 screws per 4x8 sheet (or ~1 screw per sq ft)
  const screwsEstimateCount = sheetsToBuy * 32;
  // Joint compound: approx 0.05 gallons per sq ft (or ~0.2 liters per sq m)
  const jointCompound = unit === 'imperial'
    ? totalBoardAreaNeeded * 0.05
    : totalBoardAreaNeeded * 0.20;
  // Tape: approx 1.2 to 1.5 linear ft per sq ft (or 1.2 m per sq m)
  const tapeLength = totalBoardAreaNeeded * 1.3;

  const sheetNames: Record<string, string> = {
    '4x8': '4 ft × 8 ft (32 sq ft standard)',
    '4x10': '4 ft × 10 ft (40 sq ft for tall walls)',
    '4x12': '4 ft × 12 ft (48 sq ft for fewer seams)',
    'metric_12x24': '1.2 m × 2.4 m (2.88 sq m)',
    'metric_12x30': '1.2 m × 3.0 m (3.60 sq m)',
  };

  const guidance = `Using ${sheetNames[sheetType] || sheetType} sheets. Installing boards horizontally across studs reduces vertical seams and produces smoother walls.`;

  return {
    grossWallArea: Number(grossWallArea.toFixed(2)),
    deductionsArea: Number(deductionsArea.toFixed(2)),
    netWallArea: Number(netWallArea.toFixed(2)),
    ceilingArea: Number(ceilingArea.toFixed(2)),
    totalBoardAreaNeeded: Number(totalBoardAreaNeeded.toFixed(2)),
    totalAreaWithWaste: Number(totalAreaWithWaste.toFixed(2)),
    singleSheetArea: Number(sheetArea.toFixed(2)),
    sheetsToBuy,
    screwsEstimateCount,
    jointCompoundGallons: Number(jointCompound.toFixed(1)),
    tapeLengthNeeded: Number(tapeLength.toFixed(1)),
    guidance,
  };
}
