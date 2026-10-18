import { UnitSystem, ceilPurchasable } from '../conversions';

export interface TileInput {
  surfaceLength: number; // ft or m
  surfaceWidth: number; // ft or m
  tileLength: number; // inches or cm
  tileWidth: number; // inches or cm
  groutSpacing: number; // inches or mm (0 for edge-to-edge)
  wastePercent: number; // 10, 15, 20
  tilesPerBox: number;
  unit: UnitSystem;
}

export interface TileResult {
  surfaceArea: number;
  singleTileArea: number; // sq ft or sq m
  netTilesNeeded: number;
  wasteTiles: number;
  totalTilesNeeded: number;
  boxesRequired: number;
  totalCoveragePurchased: number;
  leftoverTiles: number;
  guidance: string;
}

export function calculateTiles(input: TileInput): TileResult {
  const {
    surfaceLength,
    surfaceWidth,
    tileLength,
    tileWidth,
    groutSpacing,
    wastePercent,
    tilesPerBox,
    unit,
  } = input;

  if (surfaceLength <= 0 || surfaceWidth <= 0) {
    throw new Error('Surface dimensions must be greater than zero.');
  }
  if (tileLength <= 0 || tileWidth <= 0) {
    throw new Error('Tile dimensions must be greater than zero.');
  }
  if (tilesPerBox <= 0) {
    throw new Error('Tiles per box must be at least 1.');
  }

  const surfaceArea = surfaceLength * surfaceWidth;

  // Tile area including grout
  let effectiveTileArea = 0;
  if (unit === 'imperial') {
    // Length & width in inches, grout in inches
    const effLenIn = tileLength + Math.max(0, groutSpacing);
    const effWidIn = tileWidth + Math.max(0, groutSpacing);
    effectiveTileArea = (effLenIn * effWidIn) / 144; // sq ft
  } else {
    // Length & width in cm, grout in mm -> cm
    const groutCm = Math.max(0, groutSpacing) / 10;
    const effLenM = (tileLength + groutCm) / 100;
    const effWidM = (tileWidth + groutCm) / 100;
    effectiveTileArea = effLenM * effWidM; // sq m
  }

  const netTilesNeeded = Math.ceil(surfaceArea / effectiveTileArea);
  const wasteTiles = Math.ceil(netTilesNeeded * (wastePercent / 100));
  const totalTilesNeeded = netTilesNeeded + wasteTiles;

  const boxesRequired = ceilPurchasable(totalTilesNeeded / tilesPerBox);
  const totalTilesPurchased = boxesRequired * tilesPerBox;
  const totalCoveragePurchased = totalTilesPurchased * effectiveTileArea;
  const leftoverTiles = totalTilesPurchased - totalTilesNeeded;

  const guidance = `Straight grid layouts typically need 10% waste for perimeter cuts. Diagonal, herringbone, or chevron patterns should allow 15–20% extra tiles due to 45-degree angle trimming.`;

  return {
    surfaceArea: Number(surfaceArea.toFixed(2)),
    singleTileArea: Number(effectiveTileArea.toFixed(4)),
    netTilesNeeded,
    wasteTiles,
    totalTilesNeeded,
    boxesRequired,
    totalCoveragePurchased: Number(totalCoveragePurchased.toFixed(2)),
    leftoverTiles,
    guidance,
  };
}
