import {
  UnitSystem,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  sqFeetToSqYards,
  sqMetersToSqYards,
  sqFeetToAcres,
  sqMetersToAcres,
} from '../conversions';

export interface ShapeItem {
  id: string;
  type: 'rectangle' | 'triangle' | 'circle' | 'deduction';
  name: string;
  dim1: number; // length, base, radius, or deduction length
  dim2?: number; // width, height, or deduction width
  area: number;
}

export interface SquareFootageInput {
  shapes: Array<{
    type: 'rectangle' | 'triangle' | 'circle' | 'deduction';
    dim1: number;
    dim2?: number;
    name?: string;
  }>;
  unit: UnitSystem;
}

export interface SquareFootageResult {
  shapeBreakdown: ShapeItem[];
  subtotalArea: number;
  deductionArea: number;
  netAreaSqFt: number;
  netAreaSqM: number;
  netAreaSqYards: number;
  netAreaAcres?: number;
  summary: string;
}

export function calculateSquareFootage(input: SquareFootageInput): SquareFootageResult {
  const { shapes, unit } = input;

  if (!shapes || shapes.length === 0) {
    throw new Error('At least one area section is required.');
  }

  let subtotal = 0;
  let deductions = 0;
  const shapeBreakdown: ShapeItem[] = [];

  shapes.forEach((item, idx) => {
    if (item.dim1 <= 0) {
      throw new Error(`Section ${idx + 1} dimensions must be greater than zero.`);
    }

    let area = 0;
    let label = item.name || `Section ${idx + 1}`;

    if (item.type === 'rectangle') {
      const dim2 = item.dim2 || 0;
      if (dim2 <= 0) throw new Error(`Rectangle "${label}" width must be greater than zero.`);
      area = item.dim1 * dim2;
      subtotal += area;
    } else if (item.type === 'triangle') {
      const dim2 = item.dim2 || 0;
      if (dim2 <= 0) throw new Error(`Triangle "${label}" height must be greater than zero.`);
      area = (item.dim1 * dim2) / 2;
      subtotal += area;
    } else if (item.type === 'circle') {
      area = Math.PI * Math.pow(item.dim1, 2);
      subtotal += area;
    } else if (item.type === 'deduction') {
      const dim2 = item.dim2 || 0;
      if (dim2 <= 0) throw new Error(`Deduction "${label}" width must be greater than zero.`);
      area = item.dim1 * dim2;
      deductions += area;
    }

    shapeBreakdown.push({
      id: `shape-${idx}`,
      type: item.type,
      name: label,
      dim1: item.dim1,
      dim2: item.dim2,
      area: Number(area.toFixed(2)),
    });
  });

  const netAreaInCurrentUnit = Math.max(0, subtotal - deductions);

  let netSqFt = 0;
  let netSqM = 0;
  let netSqYd = 0;
  let acres: number | undefined;

  if (unit === 'imperial') {
    netSqFt = netAreaInCurrentUnit;
    netSqM = sqFeetToSqMeters(netAreaInCurrentUnit);
    netSqYd = sqFeetToSqYards(netAreaInCurrentUnit);
    if (netSqFt >= 5000) {
      acres = sqFeetToAcres(netSqFt);
    }
  } else {
    netSqM = netAreaInCurrentUnit;
    netSqFt = sqMetersToSqFeet(netAreaInCurrentUnit);
    netSqYd = sqMetersToSqYards(netAreaInCurrentUnit);
    if (netSqM >= 500) {
      acres = sqMetersToAcres(netSqM);
    }
  }

  const unitStr = unit === 'imperial' ? 'sq ft' : 'm²';
  const summary = `Total net area is ${Number(netSqFt.toFixed(1))} sq ft (${Number(netSqM.toFixed(1))} m² / ${Number(netSqYd.toFixed(1))} sq yd) calculated across ${shapes.length} geometric segments.`;

  return {
    shapeBreakdown,
    subtotalArea: Number(subtotal.toFixed(2)),
    deductionArea: Number(deductions.toFixed(2)),
    netAreaSqFt: Number(netSqFt.toFixed(2)),
    netAreaSqM: Number(netSqM.toFixed(2)),
    netAreaSqYards: Number(netSqYd.toFixed(2)),
    netAreaAcres: acres ? Number(acres.toFixed(4)) : undefined,
    summary,
  };
}
