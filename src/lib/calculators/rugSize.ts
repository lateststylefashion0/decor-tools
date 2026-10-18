import { UnitSystem, feetToMeters, metersToFeet } from '../conversions';

export interface RugSizeInput {
  roomLength: number; // in feet (if imperial) or meters (if metric)
  roomWidth: number;
  arrangement: 'all' | 'front' | 'center';
  unit: UnitSystem;
}

export interface StandardRug {
  nameImperial: string;
  nameMetric: string;
  widthFt: number;
  lengthFt: number;
  widthM: number;
  lengthM: number;
  widthIn: number;
  lengthIn: number;
  areaSqFt: number;
  areaSqM: number;
}

export const STANDARD_RUGS: StandardRug[] = [
  { nameImperial: '3 ft × 5 ft', nameMetric: '0.9 m × 1.5 m', widthFt: 3, lengthFt: 5, widthM: 0.91, lengthM: 1.52, widthIn: 36, lengthIn: 60, areaSqFt: 15, areaSqM: 1.39 },
  { nameImperial: '4 ft × 6 ft', nameMetric: '1.2 m × 1.8 m', widthFt: 4, lengthFt: 6, widthM: 1.22, lengthM: 1.83, widthIn: 48, lengthIn: 72, areaSqFt: 24, areaSqM: 2.23 },
  { nameImperial: '5 ft × 8 ft', nameMetric: '1.5 m × 2.4 m', widthFt: 5, lengthFt: 8, widthM: 1.52, lengthM: 2.44, widthIn: 60, lengthIn: 96, areaSqFt: 40, areaSqM: 3.72 },
  { nameImperial: '6 ft × 9 ft', nameMetric: '1.8 m × 2.7 m', widthFt: 6, lengthFt: 9, widthM: 1.83, lengthM: 2.74, widthIn: 72, lengthIn: 108, areaSqFt: 54, areaSqM: 5.02 },
  { nameImperial: '8 ft × 10 ft', nameMetric: '2.4 m × 3.0 m', widthFt: 8, lengthFt: 10, widthM: 2.44, lengthM: 3.05, widthIn: 96, lengthIn: 120, areaSqFt: 80, areaSqM: 7.43 },
  { nameImperial: '9 ft × 12 ft', nameMetric: '2.7 m × 3.6 m', widthFt: 9, lengthFt: 12, widthM: 2.74, lengthM: 3.66, widthIn: 108, lengthIn: 144, areaSqFt: 108, areaSqM: 10.03 },
  { nameImperial: '10 ft × 14 ft', nameMetric: '3.0 m × 4.2 m', widthFt: 10, lengthFt: 14, widthM: 3.05, lengthM: 4.27, widthIn: 120, lengthIn: 168, areaSqFt: 140, areaSqM: 13.01 },
  { nameImperial: '12 ft × 15 ft', nameMetric: '3.6 m × 4.5 m', widthFt: 12, lengthFt: 15, widthM: 3.66, lengthM: 4.57, widthIn: 144, lengthIn: 180, areaSqFt: 180, areaSqM: 16.72 },
];

export interface RugSizeResult {
  roomArea: number; // in current unit sq ft or sq m
  recommendedWidth: number;
  recommendedLength: number;
  bestFit: StandardRug;
  largerOption?: StandardRug;
  smallerOption?: StandardRug;
  coveragePercent: number;
  guidelineNotes: string;
}

export function calculateRugSize(input: RugSizeInput): RugSizeResult {
  const { roomLength, roomWidth, arrangement, unit } = input;
  if (roomLength <= 0 || roomWidth <= 0) {
    throw new Error('Room length and width must be greater than zero.');
  }

  // Convert to feet internally for consistent calculation
  const lengthFt = unit === 'imperial' ? roomLength : metersToFeet(roomLength);
  const widthFt = unit === 'imperial' ? roomWidth : metersToFeet(roomWidth);

  const minDimFt = Math.min(lengthFt, widthFt);
  const maxDimFt = Math.max(lengthFt, widthFt);
  const roomAreaFt = lengthFt * widthFt;

  let recWidthFt = 0;
  let recLengthFt = 0;
  let guideline = '';

  if (arrangement === 'all') {
    // All furniture on rug: Leave 12-18 inches (1 to 1.5 ft) perimeter from room walls
    const border = Math.min(1.5, minDimFt * 0.12);
    recWidthFt = Math.max(3, minDimFt - border * 2);
    recLengthFt = Math.max(5, maxDimFt - border * 2);
    guideline = 'For all-furniture placement, leaving 12–18 inches of bare floor around the room edges frames the seating group beautifully.';
  } else if (arrangement === 'front') {
    // Front legs only: Rug covers central seating area extending slightly under front sofa/chair legs
    recWidthFt = Math.max(3, minDimFt * 0.65);
    recLengthFt = Math.max(4, maxDimFt * 0.70);
    guideline = 'Front legs on the rug grounds the conversation area while keeping pathways open and spacious.';
  } else {
    // Coffee table / center only
    recWidthFt = Math.max(3, minDimFt * 0.45);
    recLengthFt = Math.max(4, maxDimFt * 0.52);
    guideline = 'A center accent rug defines the coffee table without dominating smaller rooms or busy walking zones.';
  }

  const targetAreaFt = recWidthFt * recLengthFt;

  // Find standard rug closest in area to targetAreaFt that fits within room
  const fittingRugs = STANDARD_RUGS.filter(r => r.widthFt < minDimFt && r.lengthFt < maxDimFt);
  const candidatePool = fittingRugs.length > 0 ? fittingRugs : STANDARD_RUGS;

  // Sort by difference to target area
  const sorted = [...candidatePool].sort((a, b) => Math.abs(a.areaSqFt - targetAreaFt) - Math.abs(b.areaSqFt - targetAreaFt));
  const bestFit = sorted[0];

  const poolByArea = [...candidatePool].sort((a, b) => a.areaSqFt - b.areaSqFt);
  const bestIdx = poolByArea.findIndex(r => r.nameImperial === bestFit.nameImperial);

  const smallerOption = bestIdx > 0 ? poolByArea[bestIdx - 1] : undefined;
  const largerOption = bestIdx < poolByArea.length - 1 ? poolByArea[bestIdx + 1] : undefined;

  const coveragePercent = Math.min(100, Math.round((bestFit.areaSqFt / roomAreaFt) * 100));

  const roomAreaDisplay = unit === 'imperial' ? roomAreaFt : roomAreaFt * 0.09290304;
  const recWidthDisplay = unit === 'imperial' ? recWidthFt : feetToMeters(recWidthFt);
  const recLengthDisplay = unit === 'imperial' ? recLengthFt : feetToMeters(recLengthFt);

  return {
    roomArea: Number(roomAreaDisplay.toFixed(2)),
    recommendedWidth: Number(recWidthDisplay.toFixed(2)),
    recommendedLength: Number(recLengthDisplay.toFixed(2)),
    bestFit,
    largerOption,
    smallerOption,
    coveragePercent,
    guidelineNotes: guideline,
  };
}
