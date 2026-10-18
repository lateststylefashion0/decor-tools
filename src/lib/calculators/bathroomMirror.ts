import { UnitSystem } from '../conversions';

export interface BathroomMirrorInput {
  vanityWidth: number; // inches or cm
  sinksCount: 1 | 2;
  mirrorToVanityRatio: number; // typically 0.70 to 0.80 (default 0.75)
  availableWallHeight: number; // vanity top to ceiling or fixture
  faucetClearance?: number; // clearance above faucet (default 5 in or 12 cm)
  lightClearance?: number; // clearance below light (default 4 in or 10 cm)
  unit: UnitSystem;
}

export interface BathroomMirrorResult {
  singleMirrorWidth: number;
  singleMirrorHeight: number;
  dualMirrorWidth?: number;
  dualMirrorHeight?: number;
  gapBetweenDualMirrors?: number;
  recommendedHangingHeightAboveVanity: number;
  recommendedCenterFromFloor: number;
  guidance: string;
}

export function calculateBathroomMirror(input: BathroomMirrorInput): BathroomMirrorResult {
  const {
    vanityWidth,
    sinksCount,
    mirrorToVanityRatio,
    availableWallHeight,
    faucetClearance = input.unit === 'imperial' ? 5 : 12,
    lightClearance = input.unit === 'imperial' ? 4 : 10,
    unit,
  } = input;

  if (vanityWidth <= 0 || availableWallHeight <= 0) {
    throw new Error('Vanity width and wall height must be greater than zero.');
  }

  // Recommended single mirror width = vanity width * ratio (typically 70-80% of vanity)
  const singleMirrorWidth = vanityWidth * mirrorToVanityRatio;

  // Maximum usable height between faucet clearance and light clearance
  const maxUsableHeight = availableWallHeight - faucetClearance - lightClearance;
  // A standard pleasing vertical mirror is approx 30–36 inches (75–90 cm), or 60-70% of available height
  const singleMirrorHeight = Math.min(maxUsableHeight, Math.max(unit === 'imperial' ? 24 : 60, maxUsableHeight * 0.8));

  let dualMirrorWidth: number | undefined;
  let dualMirrorHeight: number | undefined;
  let gapBetweenDualMirrors: number | undefined;

  if (sinksCount === 2 || vanityWidth >= (unit === 'imperial' ? 60 : 150)) {
    // For double mirrors: each mirror sits centered above a sink
    // Vanity is divided into halves. Each sink has ~0.5 of width.
    const spacing = unit === 'imperial' ? 4 : 10; // gap between mirrors
    const perSinkWidth = (vanityWidth - spacing) / 2;
    dualMirrorWidth = perSinkWidth * mirrorToVanityRatio;
    dualMirrorHeight = singleMirrorHeight;
    gapBetweenDualMirrors = spacing;
  }

  // Recommended mounting: bottom of mirror 5–10 inches (12–25 cm) above countertop or 2-3 in above tall faucet
  const hangingAboveVanity = faucetClearance;

  // Center of mirror should align with average eye level (~64–66 in / 162–168 cm from floor)
  const eyeLevel = unit === 'imperial' ? 65 : 165;

  const unitStr = unit === 'imperial' ? 'in' : 'cm';
  const guidance = sinksCount === 2
    ? `For a double sink vanity (${vanityWidth} ${unitStr}), you can install two separate mirrors (${dualMirrorWidth?.toFixed(1)} × ${dualMirrorHeight?.toFixed(1)} ${unitStr}) centered over each basin, or a single expansive mirror (${singleMirrorWidth.toFixed(1)} × ${singleMirrorHeight.toFixed(1)} ${unitStr}) that spans the full grooming zone.`
    : `A mirror width of ${singleMirrorWidth.toFixed(1)} ${unitStr} leaves balanced 2–4 ${unitStr} margins on either side of the vanity. Hang the bottom edge ~${hangingAboveVanity} ${unitStr} above the countertop.`;

  return {
    singleMirrorWidth: Number(singleMirrorWidth.toFixed(1)),
    singleMirrorHeight: Number(singleMirrorHeight.toFixed(1)),
    dualMirrorWidth: dualMirrorWidth ? Number(dualMirrorWidth.toFixed(1)) : undefined,
    dualMirrorHeight: dualMirrorHeight ? Number(dualMirrorHeight.toFixed(1)) : undefined,
    gapBetweenDualMirrors,
    recommendedHangingHeightAboveVanity: Number(hangingAboveVanity.toFixed(1)),
    recommendedCenterFromFloor: eyeLevel,
    guidance,
  };
}
