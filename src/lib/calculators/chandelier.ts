import { UnitSystem, metersToFeet } from '../conversions';

export interface ChandelierInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  ceilingHeight: number; // ft or m
  diningTableWidth?: number; // inches or cm
  diningTableLength?: number; // inches or cm
  unit: UnitSystem;
}

export interface ChandelierResult {
  roomChandelierDiameterInches: number;
  roomChandelierDiameterCm: number;
  chandelierHeightMinInches: number;
  chandelierHeightMaxInches: number;
  chandelierHeightMinCm: number;
  chandelierHeightMaxCm: number;
  tableChandelierDiameterInches?: number;
  tableChandelierDiameterCm?: number;
  hangingHeightOpenFloor: string;
  hangingHeightAboveTable?: string;
  designRuleExplanation: string;
}

export function calculateChandelier(input: ChandelierInput): ChandelierResult {
  const {
    roomLength,
    roomWidth,
    ceilingHeight,
    diningTableWidth,
    diningTableLength,
    unit,
  } = input;

  if (roomLength <= 0 || roomWidth <= 0 || ceilingHeight <= 0) {
    throw new Error('Room dimensions and ceiling height must be positive numbers.');
  }

  const lengthFt = unit === 'imperial' ? roomLength : metersToFeet(roomLength);
  const widthFt = unit === 'imperial' ? roomWidth : metersToFeet(roomWidth);
  const heightFt = unit === 'imperial' ? ceilingHeight : metersToFeet(ceilingHeight);

  // Classic design formula: Diameter in inches = Room Length (ft) + Room Width (ft)
  const diamInches = Math.round(lengthFt + widthFt);
  const diamCm = Math.round(diamInches * 2.54);

  // Height formula: 2.5 to 3 inches of fixture height per foot of ceiling height
  const heightMinInches = Math.round(heightFt * 2.5);
  const heightMaxInches = Math.round(heightFt * 3.0);
  const heightMinCm = Math.round(heightMinInches * 2.54);
  const heightMaxCm = Math.round(heightMaxInches * 2.54);

  let tableDiamInches: number | undefined;
  let tableDiamCm: number | undefined;
  let hangingTable: string | undefined;

  if (diningTableWidth && diningTableWidth > 0) {
    const tableWidthIn = unit === 'imperial' ? diningTableWidth : diningTableWidth / 2.54;
    // Over dining table: 1/2 to 2/3 of table width (or table width minus 12 inches)
    tableDiamInches = Math.round(tableWidthIn * 0.60);
    tableDiamCm = Math.round(tableDiamInches * 2.54);
    hangingTable = unit === 'imperial'
      ? 'Hang 30–36 inches above the tabletop'
      : 'Hang 76–91 cm above the tabletop';
  }

  const hangingOpen = unit === 'imperial'
    ? 'Maintain at least 7 feet (84 in) clearance from the floor'
    : 'Maintain at least 2.13 m (213 cm) clearance from the floor';

  const designRuleExplanation = `The golden interior design rule adds room length and width in feet (${lengthFt.toFixed(1)} + ${widthFt.toFixed(1)} = ${diamInches}") to establish the ideal chandelier diameter in inches. For ceiling height (${heightFt.toFixed(1)} ft), allow 2.5–3 inches of chandelier body per vertical foot.`;

  return {
    roomChandelierDiameterInches: diamInches,
    roomChandelierDiameterCm: diamCm,
    chandelierHeightMinInches: heightMinInches,
    chandelierHeightMaxInches: heightMaxInches,
    chandelierHeightMinCm: heightMinCm,
    chandelierHeightMaxCm: heightMaxCm,
    tableChandelierDiameterInches: tableDiamInches,
    tableChandelierDiameterCm: tableDiamCm,
    hangingHeightOpenFloor: hangingOpen,
    hangingHeightAboveTable: hangingTable,
    designRuleExplanation,
  };
}
