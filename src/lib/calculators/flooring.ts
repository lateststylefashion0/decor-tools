import { UnitSystem, ceilPurchasable } from '../conversions';

export interface FlooringInput {
  roomLength: number;
  roomWidth: number;
  materialType: 'hardwood' | 'laminate' | 'vinyl' | 'engineered' | 'bamboo';
  wastePercent: number; // e.g. 5, 10, 15
  packageCoverage: number; // sq ft or sq m per box
  unitPrice?: number; // optional price per sq ft or sq m
  unit: UnitSystem;
}

export interface FlooringResult {
  floorArea: number;
  wasteArea: number;
  totalAreaToPurchase: number;
  boxesRequired: number;
  totalBoxCoverage: number;
  leftoverArea: number;
  estimatedCost?: number;
  recommendation: string;
}

export function calculateFlooring(input: FlooringInput): FlooringResult {
  const { roomLength, roomWidth, materialType, wastePercent, packageCoverage, unitPrice, unit } = input;

  if (roomLength <= 0 || roomWidth <= 0) {
    throw new Error('Room dimensions must be greater than zero.');
  }
  if (packageCoverage <= 0) {
    throw new Error('Package coverage must be greater than zero.');
  }

  const floorArea = roomLength * roomWidth;
  const wasteArea = floorArea * (wastePercent / 100);
  const totalAreaToPurchase = floorArea + wasteArea;

  const boxesRequired = ceilPurchasable(totalAreaToPurchase / packageCoverage);
  const totalBoxCoverage = boxesRequired * packageCoverage;
  const leftoverArea = Math.max(0, totalBoxCoverage - floorArea);

  const estimatedCost = unitPrice && unitPrice > 0 ? totalBoxCoverage * unitPrice : undefined;

  const materialNames: Record<string, string> = {
    hardwood: 'Solid Hardwood (recommend 10–12% waste for grading and cuts)',
    laminate: 'Laminate Planks (recommend 8–10% waste)',
    vinyl: 'Luxury Vinyl Plank (LVP) (recommend 7–10% waste)',
    engineered: 'Engineered Hardwood (recommend 8–10% waste)',
    bamboo: 'Strand Bamboo (recommend 10% waste)',
  };

  const unitLabel = unit === 'imperial' ? 'sq ft' : 'sq m';
  const recommendation = `For ${materialNames[materialType] || materialType}, factoring a ${wastePercent}% cutting waste margin ensures complete coverage without delays. Purchasing ${boxesRequired} boxes provides ${totalBoxCoverage.toFixed(1)} ${unitLabel}.`;

  return {
    floorArea: Number(floorArea.toFixed(2)),
    wasteArea: Number(wasteArea.toFixed(2)),
    totalAreaToPurchase: Number(totalAreaToPurchase.toFixed(2)),
    boxesRequired,
    totalBoxCoverage: Number(totalBoxCoverage.toFixed(2)),
    leftoverArea: Number(leftoverArea.toFixed(2)),
    estimatedCost: estimatedCost ? Number(estimatedCost.toFixed(2)) : undefined,
    recommendation,
  };
}
