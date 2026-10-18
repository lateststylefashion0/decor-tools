import { UnitSystem, metersToInches } from '../conversions';

export interface TVSizeInput {
  wallWidth: number; // inches or cm
  wallHeight: number; // inches or cm
  viewingDistance: number; // feet or meters
  aspectRatio?: '16:9';
  viewingAnglePreference: 'cinema' | 'mixed' | 'smpte'; // cinema=40°, mixed=36°, smpte=30°
  unit: UnitSystem;
}

export interface TVSizeResult {
  recommendedDiagonalMin: number;
  recommendedDiagonalIdeal: number;
  recommendedDiagonalMax: number;
  idealScreenWidthInches: number;
  idealScreenHeightInches: number;
  idealScreenWidthCm: number;
  idealScreenHeightCm: number;
  fittingCommercialSizes: Array<{
    diagonal: number;
    widthInches: number;
    heightInches: number;
    fitsWall: boolean;
  }>;
  recommendedMountingCenterHeight: string;
  viewingDistanceGuidance: string;
}

export function calculateTVSize(input: TVSizeInput): TVSizeResult {
  const {
    wallWidth,
    wallHeight,
    viewingDistance,
    viewingAnglePreference,
    unit,
  } = input;

  if (wallWidth <= 0 || wallHeight <= 0 || viewingDistance <= 0) {
    throw new Error('Wall dimensions and viewing distance must be greater than zero.');
  }

  // Convert distance to inches
  const distIn = unit === 'imperial' ? viewingDistance * 12 : metersToInches(viewingDistance);

  // Convert wall to inches for comparison
  const wallWidthIn = unit === 'imperial' ? wallWidth : wallWidth / 2.54;
  const wallHeightIn = unit === 'imperial' ? wallHeight : wallHeight / 2.54;

  // Viewing angle multipliers
  // 30° SMPTE: distance * 0.625
  // 36° Mixed: distance * 0.73
  // 40° Cinema (THX): distance * 0.84
  const minDiag = distIn * 0.58;
  const idealDiag = viewingAnglePreference === 'cinema'
    ? distIn * 0.84
    : viewingAnglePreference === 'mixed'
    ? distIn * 0.73
    : distIn * 0.63;
  const maxDiag = distIn * 0.88;

  // Pythagorean theorem for 16:9 ratio
  // diagonal = sqrt(w^2 + h^2)
  // w = diagonal * 16 / sqrt(16^2 + 9^2) = diagonal * 16 / sqrt(337) ≈ 0.871575
  // h = diagonal * 9 / sqrt(337) ≈ 0.490261
  const PYTHAG_W = 16 / Math.sqrt(337);
  const PYTHAG_H = 9 / Math.sqrt(337);

  const idealWIn = idealDiag * PYTHAG_W;
  const idealHIn = idealDiag * PYTHAG_H;

  const commonSizes = [43, 50, 55, 65, 75, 85, 98];
  const fittingCommercialSizes = commonSizes.map(size => {
    const w = size * PYTHAG_W;
    const h = size * PYTHAG_H;
    // Account for 2" bezel/margin around TV
    const fits = (w + 4) <= wallWidthIn && (h + 4) <= wallHeightIn;
    return {
      diagonal: size,
      widthInches: Number(w.toFixed(1)),
      heightInches: Number(h.toFixed(1)),
      fitsWall: fits,
    };
  });

  const mountHeight = unit === 'imperial'
    ? 'Mount screen center ~42 inches (107 cm) from floor (seated eye level)'
    : 'Mount screen center ~107 cm from floor (seated eye level)';

  const viewingDistanceGuidance = `At a viewing distance of ${viewingDistance} ${unit === 'imperial' ? 'ft' : 'm'}, an ideal screen size is ${Math.round(idealDiag)}" (${Math.round(minDiag)}" to ${Math.round(maxDiag)}" range). Note: Screen dimensions exclude television bezels, stand depth, and speaker clearance.`;

  return {
    recommendedDiagonalMin: Math.round(minDiag),
    recommendedDiagonalIdeal: Math.round(idealDiag),
    recommendedDiagonalMax: Math.round(maxDiag),
    idealScreenWidthInches: Number(idealWIn.toFixed(1)),
    idealScreenHeightInches: Number(idealHIn.toFixed(1)),
    idealScreenWidthCm: Number((idealWIn * 2.54).toFixed(1)),
    idealScreenHeightCm: Number((idealHIn * 2.54).toFixed(1)),
    fittingCommercialSizes,
    recommendedMountingCenterHeight: mountHeight,
    viewingDistanceGuidance,
  };
}
