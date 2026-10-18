import { UnitSystem } from '../conversions';

export interface CarpetInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  rollWidth: number; // ft or m (standard: 12 ft or 15 ft / 3.66 m or 4.0 m)
  wastePercent: number; // default 10%
  pricePerUnit?: number; // per sq yd (imperial) or sq m (metric)
  underlayPricePerUnit?: number; // optional
  unit: UnitSystem;
}

export interface CarpetResult {
  floorAreaSqFt: number;
  floorAreaSqM: number;
  floorAreaSqYards: number;
  linearRollLengthNeeded: number;
  carpetAreaWithWaste: number;
  underlayAreaNeeded: number;
  estimatedCarpetCost?: number;
  estimatedUnderlayCost?: number;
  totalEstimatedCost?: number;
  installationAdvice: string;
}

export function calculateCarpet(input: CarpetInput): CarpetResult {
  const {
    roomLength,
    roomWidth,
    rollWidth,
    wastePercent,
    pricePerUnit,
    underlayPricePerUnit,
    unit,
  } = input;

  if (roomLength <= 0 || roomWidth <= 0 || rollWidth <= 0) {
    throw new Error('Room and carpet roll dimensions must be positive numbers.');
  }

  const length = Math.max(roomLength, roomWidth);
  const width = Math.min(roomLength, roomWidth);
  const floorArea = length * width;

  let areaSqFt = 0;
  let areaSqM = 0;
  let areaSqYards = 0;

  if (unit === 'imperial') {
    areaSqFt = floorArea;
    areaSqM = floorArea * 0.09290304;
    areaSqYards = floorArea / 9;
  } else {
    areaSqM = floorArea;
    areaSqFt = floorArea / 0.09290304;
    areaSqYards = areaSqFt / 9;
  }

  // Roll layout estimation:
  // How many roll widths span the narrower room dimension?
  const stripsRequired = Math.ceil(width / rollWidth);
  const linearRollLength = (stripsRequired * length) * (1 + wastePercent / 100);

  const carpetAreaWithWaste = (unit === 'imperial' ? areaSqFt : areaSqM) * (1 + wastePercent / 100);
  const underlayArea = unit === 'imperial' ? areaSqFt : areaSqM;

  let carpetCost: number | undefined;
  let underlayCost: number | undefined;

  if (pricePerUnit && pricePerUnit > 0) {
    // In imperial, carpet is commonly priced per square yard
    const billableArea = unit === 'imperial' ? (carpetAreaWithWaste / 9) : carpetAreaWithWaste;
    carpetCost = billableArea * pricePerUnit;
  }

  if (underlayPricePerUnit && underlayPricePerUnit > 0) {
    const billableUnderlay = unit === 'imperial' ? (underlayArea / 9) : underlayArea;
    underlayCost = billableUnderlay * underlayPricePerUnit;
  }

  const totalCost = (carpetCost || 0) + (underlayCost || 0);

  const unitLabel = unit === 'imperial' ? 'ft' : 'm';
  const installationAdvice = `Using standard ${rollWidth} ${unitLabel} rolls. Ensure all carpet pieces run in the same pile direction (nap flow) to avoid mismatched shading at seams. Doorway thresholds should be reinforced with tack strips.`;

  return {
    floorAreaSqFt: Number(areaSqFt.toFixed(2)),
    floorAreaSqM: Number(areaSqM.toFixed(2)),
    floorAreaSqYards: Number(areaSqYards.toFixed(2)),
    linearRollLengthNeeded: Number(linearRollLength.toFixed(2)),
    carpetAreaWithWaste: Number(carpetAreaWithWaste.toFixed(2)),
    underlayAreaNeeded: Number(underlayArea.toFixed(2)),
    estimatedCarpetCost: carpetCost ? Number(carpetCost.toFixed(2)) : undefined,
    estimatedUnderlayCost: underlayCost ? Number(underlayCost.toFixed(2)) : undefined,
    totalEstimatedCost: totalCost > 0 ? Number(totalCost.toFixed(2)) : undefined,
    installationAdvice,
  };
}
