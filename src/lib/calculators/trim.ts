import { UnitSystem, ceilPurchasable } from '../conversions';

export interface TrimInput {
  trimType: 'door_casing' | 'window_casing' | 'crown_molding' | 'chair_rail';
  width: number; // inches/cm for openings, OR ft/m for room perimeter if crown/chair
  height?: number; // inches/cm for openings
  openingCount?: number; // count of doors/windows (default 1)
  stockPieceLength: number; // ft or m (e.g. 8 ft, 12 ft or 2.4 m, 3.6 m)
  wastePercent: number; // 10, 15
  unit: UnitSystem;
}

export interface TrimResult {
  totalLinearLengthNeeded: number;
  totalWithWaste: number;
  stockPiecesRequired: number;
  totalPurchasedLength: number;
  leftoverLength: number;
  trimDescription: string;
  cuttingGuidance: string;
}

export function calculateTrim(input: TrimInput): TrimResult {
  const {
    trimType,
    width,
    height = 0,
    openingCount = 1,
    stockPieceLength,
    wastePercent,
    unit,
  } = input;

  if (width <= 0 || stockPieceLength <= 0) {
    throw new Error('Measurements and stock piece length must be greater than zero.');
  }

  let baseLinearLength = 0; // in same unit as stockPieceLength (ft or m)

  if (trimType === 'door_casing') {
    // 2 legs (height) + 1 header (width) + reveal & miter margins (~6 in / 15 cm)
    // width and height are in inches or cm
    const reveal = unit === 'imperial' ? 6 : 15;
    const perDoorLinearInOrCm = (2 * height) + width + reveal;
    const perDoor = unit === 'imperial' ? perDoorLinearInOrCm / 12 : perDoorLinearInOrCm / 100;
    baseLinearLength = perDoor * Math.max(1, openingCount);
  } else if (trimType === 'window_casing') {
    // 4 sides: 2 * (height + width) + reveal & miter margins (~8 in / 20 cm)
    const margin = unit === 'imperial' ? 8 : 20;
    const perWindowLinearInOrCm = 2 * (height + width) + margin;
    const perWindow = unit === 'imperial' ? perWindowLinearInOrCm / 12 : perWindowLinearInOrCm / 100;
    baseLinearLength = perWindow * Math.max(1, openingCount);
  } else {
    // Crown molding or chair rail: width is the total room perimeter in ft or meters
    baseLinearLength = width;
  }

  const totalWithWaste = baseLinearLength * (1 + wastePercent / 100);
  const stockPiecesRequired = ceilPurchasable(totalWithWaste / stockPieceLength);
  const totalPurchasedLength = stockPiecesRequired * stockPieceLength;
  const leftoverLength = Math.max(0, totalPurchasedLength - baseLinearLength);

  const trimLabels: Record<string, string> = {
    door_casing: `Door Casing (${openingCount} standard ${openingCount === 1 ? 'opening' : 'openings'}, 3-sided trim)`,
    window_casing: `Window Casing (${openingCount} standard ${openingCount === 1 ? 'window' : 'windows'}, 4-sided picture-frame trim)`,
    crown_molding: 'Crown Molding (ceiling perimeter trim)',
    chair_rail: 'Chair Rail / Wainscot Cap (wall perimeter run)',
  };

  const cuttingGuidance = trimType === 'crown_molding'
    ? 'Crown molding requires compound miter and bevel cuts at inside and outside corners. Allow 15% waste to account for angled test cuts.'
    : 'Miter 45-degree joints at frame corners and overlap scarf joints on long linear runs.';

  return {
    totalLinearLengthNeeded: Number(baseLinearLength.toFixed(2)),
    totalWithWaste: Number(totalWithWaste.toFixed(2)),
    stockPiecesRequired,
    totalPurchasedLength: Number(totalPurchasedLength.toFixed(2)),
    leftoverLength: Number(leftoverLength.toFixed(2)),
    trimDescription: trimLabels[trimType] || 'Trim',
    cuttingGuidance,
  };
}
