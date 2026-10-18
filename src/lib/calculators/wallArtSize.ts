import { UnitSystem } from '../conversions';

export interface WallArtInput {
  wallWidth: number; // inches or cm
  wallHeight: number; // inches or cm
  furnitureWidth?: number; // optional furniture beneath art
  arrangement: 'single' | 'two' | 'three' | 'gallery';
  proportion: number; // 0.57 to 0.75 (default 0.67)
  unit: UnitSystem;
}

export interface WallArtResult {
  totalArtworkWidth: number;
  totalArtworkHeight: number;
  pieceCount: number;
  singlePieceWidth: number;
  singlePieceHeight: number;
  spacingBetweenPieces: number;
  hangingHeightFromFloor: number;
  clearanceAboveFurniture?: number;
  coveragePercent: number;
  recommendationNote: string;
}

export function calculateWallArtSize(input: WallArtInput): WallArtResult {
  const { wallWidth, wallHeight, furnitureWidth, arrangement, proportion, unit } = input;

  if (wallWidth <= 0 || wallHeight <= 0) {
    throw new Error('Wall dimensions must be greater than zero.');
  }

  const hasFurniture = furnitureWidth && furnitureWidth > 0;
  const baseWidth = hasFurniture ? furnitureWidth : wallWidth;

  const totalWidth = baseWidth * proportion;
  // Artwork height usually follows a 3:4, 2:3, or proportional ratio to available wall height
  const maxAvailableHeight = wallHeight * 0.55;
  const totalHeight = Math.min(maxAvailableHeight, totalWidth * 0.72);

  const spacing = unit === 'imperial' ? 2.5 : 6; // 2.5 inches or 6 cm between frames

  let pieceCount = 1;
  let singleWidth = totalWidth;
  let singleHeight = totalHeight;

  if (arrangement === 'single') {
    pieceCount = 1;
    singleWidth = totalWidth;
    singleHeight = totalHeight;
  } else if (arrangement === 'two') {
    pieceCount = 2;
    singleWidth = (totalWidth - spacing) / 2;
    singleHeight = totalHeight;
  } else if (arrangement === 'three') {
    pieceCount = 3;
    singleWidth = (totalWidth - spacing * 2) / 3;
    singleHeight = totalHeight;
  } else {
    // Gallery wall: 4-6 balanced frames
    pieceCount = 6;
    singleWidth = (totalWidth - spacing * 2) / 3;
    singleHeight = (totalHeight - spacing) / 2;
  }

  // Standard museum hanging center is 57-60 inches (145-152 cm) from floor
  const eyeLevelCenter = unit === 'imperial' ? 58 : 147;
  const hangingHeightFromFloor = eyeLevelCenter - singleHeight / 2;

  const clearanceAboveFurniture = hasFurniture ? (unit === 'imperial' ? 8 : 20) : undefined;
  const coveragePercent = Math.round((totalWidth / baseWidth) * 100);

  const referenceTarget = hasFurniture ? 'furniture width' : 'wall width';
  const recommendationNote = `For a cohesive look, art should span ${Math.round(proportion * 100)}% of the ${referenceTarget}. Center pieces at eye level (~${eyeLevelCenter} ${unit === 'imperial' ? 'in' : 'cm'} from floor) or leave ${unit === 'imperial' ? '6–10 in' : '15–25 cm'} clearance above furniture.`;

  return {
    totalArtworkWidth: Number(totalWidth.toFixed(1)),
    totalArtworkHeight: Number(totalHeight.toFixed(1)),
    pieceCount,
    singlePieceWidth: Number(singleWidth.toFixed(1)),
    singlePieceHeight: Number(singleHeight.toFixed(1)),
    spacingBetweenPieces: pieceCount > 1 ? spacing : 0,
    hangingHeightFromFloor: Number(Math.max(0, hangingHeightFromFloor).toFixed(1)),
    clearanceAboveFurniture,
    coveragePercent,
    recommendationNote,
  };
}
