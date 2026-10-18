import { UnitSystem, sqFeetToSqMeters, sqMetersToSqFeet } from '../conversions';

export interface WallSegment {
  width: number; // ft or m
  height: number; // ft or m
  name?: string;
}

export interface WallAreaInput {
  walls: WallSegment[];
  doorsCount: number;
  doorWidthInOrCm?: number; // default 36 in or 90 cm
  doorHeightInOrCm?: number; // default 80 in or 200 cm
  windowsCount: number;
  windowWidthInOrCm?: number; // default 36 in or 90 cm
  windowHeightInOrCm?: number; // default 48 in or 120 cm
  unit: UnitSystem;
}

export interface WallDetail {
  name: string;
  width: number;
  height: number;
  area: number;
}

export interface WallAreaResult {
  wallBreakdown: WallDetail[];
  grossWallAreaSqFt: number;
  grossWallAreaSqM: number;
  openingsAreaSqFt: number;
  openingsAreaSqM: number;
  netWallAreaSqFt: number;
  netWallAreaSqM: number;
  estimatedPaintGallons: number;
  estimatedWallpaperRolls: number;
  summary: string;
}

export function calculateWallArea(input: WallAreaInput): WallAreaResult {
  const {
    walls,
    doorsCount,
    doorWidthInOrCm = input.unit === 'imperial' ? 36 : 90,
    doorHeightInOrCm = input.unit === 'imperial' ? 80 : 200,
    windowsCount,
    windowWidthInOrCm = input.unit === 'imperial' ? 36 : 90,
    windowHeightInOrCm = input.unit === 'imperial' ? 48 : 120,
    unit,
  } = input;

  if (!walls || walls.length === 0) {
    throw new Error('At least one wall must be specified.');
  }

  let totalGrossArea = 0;
  const wallBreakdown: WallDetail[] = [];

  walls.forEach((w, idx) => {
    if (w.width <= 0 || w.height <= 0) {
      throw new Error(`Wall ${idx + 1} dimensions must be greater than zero.`);
    }
    const area = w.width * w.height;
    totalGrossArea += area;
    wallBreakdown.push({
      name: w.name || `Wall ${idx + 1}`,
      width: w.width,
      height: w.height,
      area: Number(area.toFixed(2)),
    });
  });

  // Calculate opening areas
  let singleDoorArea = 0;
  let singleWindowArea = 0;

  if (unit === 'imperial') {
    singleDoorArea = (doorWidthInOrCm * doorHeightInOrCm) / 144; // sq ft
    singleWindowArea = (windowWidthInOrCm * windowHeightInOrCm) / 144; // sq ft
  } else {
    singleDoorArea = (doorWidthInOrCm * doorHeightInOrCm) / 10000; // sq m
    singleWindowArea = (windowWidthInOrCm * windowHeightInOrCm) / 10000; // sq m
  }

  const openingsArea = Math.min(
    totalGrossArea * 0.8,
    (doorsCount * singleDoorArea) + (windowsCount * singleWindowArea)
  );

  const netArea = Math.max(0, totalGrossArea - openingsArea);

  let grossSqFt = 0;
  let grossSqM = 0;
  let openSqFt = 0;
  let openSqM = 0;
  let netSqFt = 0;
  let netSqM = 0;

  if (unit === 'imperial') {
    grossSqFt = totalGrossArea;
    grossSqM = sqFeetToSqMeters(totalGrossArea);
    openSqFt = openingsArea;
    openSqM = sqFeetToSqMeters(openingsArea);
    netSqFt = netArea;
    netSqM = sqFeetToSqMeters(netArea);
  } else {
    grossSqM = totalGrossArea;
    grossSqFt = sqMetersToSqFeet(totalGrossArea);
    openSqM = openingsArea;
    openSqFt = sqMetersToSqFeet(openingsArea);
    netSqM = netArea;
    netSqFt = sqMetersToSqFeet(netArea);
  }

  // Paint coverage: 350 sq ft/gal for 2 coats -> 1 gal per 175 sq ft net
  const paintGallons = Math.ceil(netSqFt / 175);
  // Wallpaper roll: ~56 sq ft per standard roll
  const wallpaperRolls = Math.ceil(netSqFt / 50);

  const summary = `Net wall area is ${Number(netSqFt.toFixed(1))} sq ft (${Number(netSqM.toFixed(1))} m²) across ${walls.length} ${walls.length === 1 ? 'wall' : 'walls'}, deducting ${doorsCount} doors and ${windowsCount} windows.`;

  return {
    wallBreakdown,
    grossWallAreaSqFt: Number(grossSqFt.toFixed(2)),
    grossWallAreaSqM: Number(grossSqM.toFixed(2)),
    openingsAreaSqFt: Number(openSqFt.toFixed(2)),
    openingsAreaSqM: Number(openSqM.toFixed(2)),
    netWallAreaSqFt: Number(netSqFt.toFixed(2)),
    netWallAreaSqM: Number(netSqM.toFixed(2)),
    estimatedPaintGallons: paintGallons,
    estimatedWallpaperRolls: wallpaperRolls,
    summary,
  };
}
