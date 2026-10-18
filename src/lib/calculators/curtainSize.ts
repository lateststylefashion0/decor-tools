import { UnitSystem } from '../conversions';

export interface CurtainInput {
  windowWidth: number; // inches or cm
  windowHeight: number; // inches or cm
  fullnessFactor: number; // 1.5, 2.0, 2.5
  curtainStyle: 'eyelet' | 'pencil' | 'pinch';
  desiredLength: 'sill' | 'below_sill' | 'floor';
  rodOverhang: number; // overhang per side (inches or cm)
  rodHeightAbove: number; // rod height above window frame (inches or cm)
  panelCount: number; // default 2
  hemAllowance: number; // top & bottom hem allowance (inches or cm)
  floorClearance?: number; // clearance off floor for floor-length (inches or cm)
  unit: UnitSystem;
}

export interface CurtainResult {
  totalRodWidth: number;
  totalFabricWidth: number;
  panelCount: number;
  singlePanelWidth: number;
  finishedCurtainLength: number;
  cutFabricLength: number;
  fabricLengthYardsOrMeters: number;
  explanation: string;
}

export function calculateCurtainSize(input: CurtainInput): CurtainResult {
  const {
    windowWidth,
    windowHeight,
    fullnessFactor,
    curtainStyle,
    desiredLength,
    rodOverhang,
    rodHeightAbove,
    panelCount,
    hemAllowance,
    floorClearance = input.unit === 'imperial' ? 0.5 : 1.3,
    unit,
  } = input;

  if (windowWidth <= 0 || windowHeight <= 0) {
    throw new Error('Window width and height must be positive numbers.');
  }
  if (panelCount <= 0) {
    throw new Error('Panel count must be at least 1.');
  }

  // Total track/rod width includes window width plus rod extension on both sides
  const totalRodWidth = windowWidth + rodOverhang * 2;

  // Total gathered fabric width required based on fullness factor
  const totalFabricWidth = totalRodWidth * fullnessFactor;
  const singlePanelWidth = totalFabricWidth / panelCount;

  // Finished length based on hang style
  let finishedLength = 0;
  if (desiredLength === 'sill') {
    // Window height + rod height above - small sill gap (~0.5 in / 1.3 cm)
    const sillGap = unit === 'imperial' ? 0.5 : 1.27;
    finishedLength = windowHeight + rodHeightAbove - sillGap;
  } else if (desiredLength === 'below_sill') {
    // Hangs approx 6 inches (15 cm) below sill
    const belowDrop = unit === 'imperial' ? 6 : 15;
    finishedLength = windowHeight + rodHeightAbove + belowDrop;
  } else {
    // Floor length: Window frame to floor (windowHeight + rodHeightAbove + typical floor apron)
    // For standard calculation, assume window height + rod height + standard lower wall clearance
    const apronDrop = unit === 'imperial' ? 24 : 60; // typical distance below standard window to floor
    finishedLength = windowHeight + rodHeightAbove + apronDrop - floorClearance;
  }

  const cutFabricLength = finishedLength + hemAllowance;

  // Total fabric in yards (imperial) or meters (metric)
  const totalLinearFabric = (cutFabricLength * panelCount);
  const fabricLengthYardsOrMeters = unit === 'imperial'
    ? totalLinearFabric / 36 // 36 inches per yard
    : totalLinearFabric / 100; // 100 cm per meter

  const styleNames = {
    eyelet: 'Eyelet / Grommet (modern, distinct uniform waves)',
    pencil: 'Pencil Pleat (classic gathered headings)',
    pinch: 'Pinch Pleat (formal, tailored French pleats)',
  };

  const explanation = `With a ${fullnessFactor}x fullness factor for ${styleNames[curtainStyle]}, the total rod width of ${totalRodWidth.toFixed(1)} ${unit === 'imperial' ? 'in' : 'cm'} requires ${totalFabricWidth.toFixed(1)} ${unit === 'imperial' ? 'in' : 'cm'} of gathered fabric divided across ${panelCount} panels.`;

  return {
    totalRodWidth: Number(totalRodWidth.toFixed(1)),
    totalFabricWidth: Number(totalFabricWidth.toFixed(1)),
    panelCount,
    singlePanelWidth: Number(singlePanelWidth.toFixed(1)),
    finishedCurtainLength: Number(finishedLength.toFixed(1)),
    cutFabricLength: Number(cutFabricLength.toFixed(1)),
    fabricLengthYardsOrMeters: Number(fabricLengthYardsOrMeters.toFixed(2)),
    explanation,
  };
}
