import {
  UnitSystem,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  feetToMeters,
  metersToFeet,
  cuFeetToCuMeters,
  cuMetersToCuFeet,
} from '../conversions';

export interface RoomSection {
  length: number;
  width: number;
  name?: string;
}

export interface RoomSizeInput {
  sections: RoomSection[];
  roomHeight?: number; // optional
  unit: UnitSystem;
}

export interface SectionDetail {
  name: string;
  length: number;
  width: number;
  area: number;
  perimeter: number;
}

export interface RoomSizeResult {
  sectionDetails: SectionDetail[];
  totalAreaSqFt: number;
  totalAreaSqM: number;
  totalAreaSqYd: number;
  totalPerimeterFt: number;
  totalPerimeterM: number;
  totalVolumeCuFt?: number;
  totalVolumeCuM?: number;
  summary: string;
}

export function calculateRoomSize(input: RoomSizeInput): RoomSizeResult {
  const { sections, roomHeight, unit } = input;

  if (!sections || sections.length === 0) {
    throw new Error('At least one room section is required.');
  }

  let totalArea = 0;
  let totalPerimeter = 0;
  const sectionDetails: SectionDetail[] = [];

  sections.forEach((sec, idx) => {
    if (sec.length <= 0 || sec.width <= 0) {
      throw new Error(`Section ${idx + 1} dimensions must be greater than zero.`);
    }
    const area = sec.length * sec.width;
    const perimeter = 2 * (sec.length + sec.width);
    totalArea += area;
    totalPerimeter += perimeter;

    sectionDetails.push({
      name: sec.name || `Section ${idx + 1}`,
      length: sec.length,
      width: sec.width,
      area: Number(area.toFixed(2)),
      perimeter: Number(perimeter.toFixed(2)),
    });
  });

  // Convert to both systems
  let areaSqFt = 0;
  let areaSqM = 0;
  let perimFt = 0;
  let perimM = 0;

  if (unit === 'imperial') {
    areaSqFt = totalArea;
    areaSqM = sqFeetToSqMeters(totalArea);
    perimFt = totalPerimeter;
    perimM = feetToMeters(totalPerimeter);
  } else {
    areaSqM = totalArea;
    areaSqFt = sqMetersToSqFeet(totalArea);
    perimM = totalPerimeter;
    perimFt = metersToFeet(totalPerimeter);
  }

  const areaSqYd = areaSqFt / 9;

  let volCuFt: number | undefined;
  let volCuM: number | undefined;

  if (roomHeight && roomHeight > 0) {
    if (unit === 'imperial') {
      volCuFt = areaSqFt * roomHeight;
      volCuM = cuFeetToCuMeters(volCuFt);
    } else {
      volCuM = areaSqM * roomHeight;
      volCuFt = cuMetersToCuFeet(volCuM);
    }
  }

  const summary = `Total space covers ${Number(areaSqFt.toFixed(1))} sq ft (${Number(areaSqM.toFixed(1))} m²) across ${sections.length} ${sections.length === 1 ? 'section' : 'sections'}.`;

  return {
    sectionDetails,
    totalAreaSqFt: Number(areaSqFt.toFixed(2)),
    totalAreaSqM: Number(areaSqM.toFixed(2)),
    totalAreaSqYd: Number(areaSqYd.toFixed(2)),
    totalPerimeterFt: Number(perimFt.toFixed(2)),
    totalPerimeterM: Number(perimM.toFixed(2)),
    totalVolumeCuFt: volCuFt ? Number(volCuFt.toFixed(2)) : undefined,
    totalVolumeCuM: volCuM ? Number(volCuM.toFixed(2)) : undefined,
    summary,
  };
}
