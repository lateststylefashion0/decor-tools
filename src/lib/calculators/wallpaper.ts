import { UnitSystem, ceilPurchasable } from '../conversions';

export interface WallpaperInput {
  wallWidth: number; // ft or m
  wallHeight: number; // ft or m
  numberOfWalls: number; // default 1 or 4
  rollWidth: number; // inches or cm (standard: 20.5 in or 53 cm)
  rollLength: number; // ft or m (standard: 33 ft or 10.05 m)
  patternRepeat: number; // inches or cm (0 for no repeat)
  doorsWindowsDeduction?: number; // sq ft or sq m
  unit: UnitSystem;
}

export interface WallpaperResult {
  totalWallArea: number;
  netWallArea: number;
  effectiveDropLength: number;
  dropsPerRoll: number;
  totalDropsRequired: number;
  rollsRequired: number;
  singleRollArea: number;
  wasteExplanation: string;
}

export function calculateWallpaper(input: WallpaperInput): WallpaperResult {
  const {
    wallWidth,
    wallHeight,
    numberOfWalls,
    rollWidth,
    rollLength,
    patternRepeat,
    doorsWindowsDeduction = 0,
    unit,
  } = input;

  if (wallWidth <= 0 || wallHeight <= 0) {
    throw new Error('Wall dimensions must be positive numbers.');
  }
  if (rollWidth <= 0 || rollLength <= 0) {
    throw new Error('Roll dimensions must be positive numbers.');
  }

  const totalWidth = wallWidth * Math.max(1, numberOfWalls);
  const totalWallArea = totalWidth * wallHeight;
  const netWallArea = Math.max(0, totalWallArea - doorsWindowsDeduction);

  // Convert roll width and pattern repeat to same linear unit as wall (ft or m)
  const rollWidthInWallUnits = unit === 'imperial' ? rollWidth / 12 : rollWidth / 100;
  const patternRepeatInWallUnits = unit === 'imperial' ? patternRepeat / 12 : patternRepeat / 100;
  const trimAllowance = unit === 'imperial' ? 0.33 : 0.10; // ~4 in / 10 cm trimming margin

  // Effective drop length accounts for wall height + pattern repeat allowance + trim
  const effectiveDropLength = wallHeight + patternRepeatInWallUnits + trimAllowance;

  // Number of full vertical strips (drops) that can be cut from a single roll
  const dropsPerRoll = Math.max(1, Math.floor(rollLength / effectiveDropLength));

  // Total drops required to cover the combined width
  const totalDropsRequired = Math.ceil(totalWidth / rollWidthInWallUnits);

  // Total rolls needed
  const rollsRequired = ceilPurchasable(totalDropsRequired / dropsPerRoll);

  const singleRollArea = rollWidthInWallUnits * rollLength;

  const repeatNote = patternRepeat > 0
    ? `A pattern repeat of ${patternRepeat} ${unit === 'imperial' ? 'in' : 'cm'} reduces the usable yield per roll to ${dropsPerRoll} drops because each drop must align vertically.`
    : 'No pattern repeat allows maximum roll utilization with minimal waste.';

  const wasteExplanation = `${repeatNote} Always order an extra roll for future repairs or batch dye-lot consistency.`;

  return {
    totalWallArea: Number(totalWallArea.toFixed(2)),
    netWallArea: Number(netWallArea.toFixed(2)),
    effectiveDropLength: Number(effectiveDropLength.toFixed(2)),
    dropsPerRoll,
    totalDropsRequired,
    rollsRequired,
    singleRollArea: Number(singleRollArea.toFixed(2)),
    wasteExplanation,
  };
}
