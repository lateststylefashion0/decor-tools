import { UnitSystem, metersToFeet, feetToMeters } from '../conversions';

export interface RecessedLightingInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  ceilingHeight: number; // ft or m
  spacingMethod: 'ceiling_rule' | 'target_lumens';
  targetIlluminationFc?: number; // foot-candles (imperial) or lux (metric)
  fixtureLumens: number; // lumens per bulb/trim (typically 650-900)
  unit: UnitSystem;
}

export interface RecessedLightingResult {
  roomArea: number;
  recommendedCount: number;
  gridRows: number;
  gridCols: number;
  spacingBetweenFixtures: number;
  spacingFromWall: number;
  totalLumensDelivered: number;
  estimatedIllumination: number; // fc or lux
  layoutExplanation: string;
}

export function calculateRecessedLighting(input: RecessedLightingInput): RecessedLightingResult {
  const {
    roomLength,
    roomWidth,
    ceilingHeight,
    spacingMethod,
    targetIlluminationFc = input.unit === 'imperial' ? 25 : 250,
    fixtureLumens,
    unit,
  } = input;

  if (roomLength <= 0 || roomWidth <= 0 || ceilingHeight <= 0) {
    throw new Error('Room dimensions and ceiling height must be greater than zero.');
  }
  if (fixtureLumens <= 0) {
    throw new Error('Fixture lumens must be greater than zero.');
  }

  const lengthFt = unit === 'imperial' ? roomLength : metersToFeet(roomLength);
  const widthFt = unit === 'imperial' ? roomWidth : metersToFeet(roomWidth);
  const heightFt = unit === 'imperial' ? ceilingHeight : metersToFeet(ceilingHeight);
  const roomAreaFt = lengthFt * widthFt;

  // 1. Spacing-based calculation: The classic lighting designer rule is spacing = ceilingHeight / 2
  const targetSpacingFt = Math.max(3.5, Math.min(7, heightFt / 2));

  // Determine grid columns (along length) and rows (along width)
  const cols = Math.max(1, Math.round(lengthFt / targetSpacingFt));
  const rows = Math.max(1, Math.round(widthFt / targetSpacingFt));
  const gridCount = cols * rows;

  // 2. Lumen-based calculation: Total Lumens = Area * Target Foot-Candles / Coefficient of Utilization (~0.65)
  const coeffUtil = 0.65;
  const targetFc = unit === 'imperial' ? targetIlluminationFc : targetIlluminationFc / 10.764;
  const totalLumensNeeded = (roomAreaFt * targetFc) / coeffUtil;
  const lumenCount = Math.max(1, Math.round(totalLumensNeeded / fixtureLumens));

  // Pick count based on user method
  let chosenCount = spacingMethod === 'ceiling_rule' ? gridCount : lumenCount;
  if (chosenCount < 1) chosenCount = 1;

  // Recalculate balanced grid for chosen count
  let finalCols = Math.max(1, Math.round(Math.sqrt((chosenCount * lengthFt) / widthFt)));
  let finalRows = Math.max(1, Math.ceil(chosenCount / finalCols));
  const finalCount = finalCols * finalRows;

  // Distance calculations
  const spacingXFt = lengthFt / finalCols;
  const wallDistXFt = spacingXFt / 2;

  const totalLumens = finalCount * fixtureLumens;
  const estimatedFc = (totalLumens * coeffUtil) / roomAreaFt;
  const estimatedIllum = unit === 'imperial' ? estimatedFc : estimatedFc * 10.764;

  const spacingDisp = unit === 'imperial' ? spacingXFt : feetToMeters(spacingXFt);
  const wallDistDisp = unit === 'imperial' ? wallDistXFt : feetToMeters(wallDistXFt);
  const roomAreaDisp = unit === 'imperial' ? roomAreaFt : roomAreaFt * 0.09290304;

  const illumUnit = unit === 'imperial' ? 'foot-candles (fc)' : 'lux';
  const layoutExplanation = `Arranging ${finalCount} fixtures in a ${finalRows} × ${finalCols} grid provides ~${estimatedIllum.toFixed(0)} ${illumUnit}. Place lights approximately ${spacingDisp.toFixed(1)} ${unit === 'imperial' ? 'ft' : 'm'} apart and ${wallDistDisp.toFixed(1)} ${unit === 'imperial' ? 'ft' : 'm'} from adjacent walls to eliminate harsh perimeter shadows.`;

  return {
    roomArea: Number(roomAreaDisp.toFixed(2)),
    recommendedCount: finalCount,
    gridRows: finalRows,
    gridCols: finalCols,
    spacingBetweenFixtures: Number(spacingDisp.toFixed(2)),
    spacingFromWall: Number(wallDistDisp.toFixed(2)),
    totalLumensDelivered: totalLumens,
    estimatedIllumination: Number(estimatedIllum.toFixed(1)),
    layoutExplanation,
  };
}
