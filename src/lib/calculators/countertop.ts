import { UnitSystem, ceilPurchasable } from '../conversions';

export interface CountertopSection {
  length: number; // inches or cm
  depth: number; // inches or cm (standard is 25.5 in or 65 cm)
  name?: string;
}

export interface CountertopInput {
  sections: CountertopSection[];
  backsplashHeight?: number; // inches or cm (e.g. 4 in or 10 cm, 0 for none)
  sinkCutoutsCount: number;
  cooktopCutoutsCount: number;
  materialThickness: '2cm' | '3cm';
  pricePerUnitArea?: number; // price per sq ft or sq m
  unit: UnitSystem;
}

export interface CountertopResult {
  grossSurfaceArea: number; // sq ft or sq m
  cutoutArea: number;
  netSurfaceArea: number;
  backsplashArea: number;
  totalFinishedArea: number;
  estimatedFabricationSlabs: number;
  totalSlabAreaProvided: number;
  estimatedCost?: number;
  fabricationNotice: string;
}

export function calculateCountertop(input: CountertopInput): CountertopResult {
  const {
    sections,
    backsplashHeight = 0,
    sinkCutoutsCount = 0,
    cooktopCutoutsCount = 0,
    pricePerUnitArea,
    unit,
  } = input;

  if (!sections || sections.length === 0) {
    throw new Error('At least one countertop section is required.');
  }

  let grossAreaSqInOrSqCm = 0;
  let totalLengthInOrCm = 0;

  sections.forEach((sec, idx) => {
    if (sec.length <= 0 || sec.depth <= 0) {
      throw new Error(`Section ${idx + 1} dimensions must be greater than zero.`);
    }
    grossAreaSqInOrSqCm += sec.length * sec.depth;
    totalLengthInOrCm += sec.length;
  });

  // Cutout estimations (sink ~ 30x20 in / 75x50 cm, cooktop ~ 30x21 in / 76x53 cm)
  const sinkCutoutArea = unit === 'imperial' ? (30 * 20) : (75 * 50);
  const cooktopCutoutArea = unit === 'imperial' ? (30 * 21) : (76 * 53);
  const totalCutoutsInOrCm = (sinkCutoutsCount * sinkCutoutArea) + (cooktopCutoutsCount * cooktopCutoutArea);

  // Backsplash area
  const backsplashAreaInOrCm = totalLengthInOrCm * Math.max(0, backsplashHeight);

  // Convert to sq ft or sq meters
  const factor = unit === 'imperial' ? 144 : 10000;
  const grossArea = grossAreaSqInOrSqCm / factor;
  const cutoutArea = totalCutoutsInOrCm / factor;
  const netArea = Math.max(0, grossArea - cutoutArea);
  const backsplashArea = backsplashAreaInOrCm / factor;
  const totalFinishedArea = netArea + backsplashArea;

  // Standard jumbo stone slab is ~55 sq ft (5.1 sq m).
  // Real fabrication requires ~20-25% waste due to directional vein flow, seam layout, and waterjet kerf.
  const slabSize = unit === 'imperial' ? 55 : 5.1;
  const fabricatorRequirement = (grossArea + backsplashArea) * 1.25;
  const estimatedFabricationSlabs = ceilPurchasable(fabricatorRequirement / slabSize);
  const totalSlabAreaProvided = estimatedFabricationSlabs * slabSize;

  const estimatedCost = pricePerUnitArea && pricePerUnitArea > 0
    ? totalFinishedArea * pricePerUnitArea
    : undefined;

  const fabricationNotice = 'Fabrication Note: Cutouts (sinks and cooktops) do not reduce stone slab costs because fabricators purchase full rectangular slabs and cut openings on-site. Grain direction and seam placements typically require 20–25% extra material.';

  return {
    grossSurfaceArea: Number(grossArea.toFixed(2)),
    cutoutArea: Number(cutoutArea.toFixed(2)),
    netSurfaceArea: Number(netArea.toFixed(2)),
    backsplashArea: Number(backsplashArea.toFixed(2)),
    totalFinishedArea: Number(totalFinishedArea.toFixed(2)),
    estimatedFabricationSlabs,
    totalSlabAreaProvided: Number(totalSlabAreaProvided.toFixed(2)),
    estimatedCost: estimatedCost ? Number(estimatedCost.toFixed(2)) : undefined,
    fabricationNotice,
  };
}
