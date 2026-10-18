import { describe, it, expect } from 'vitest';
import { calculateRugSize } from '../src/lib/calculators/rugSize';
import { calculateCurtainSize } from '../src/lib/calculators/curtainSize';
import { calculateWallArtSize } from '../src/lib/calculators/wallArtSize';
import { calculatePaint } from '../src/lib/calculators/paint';
import { calculateFlooring } from '../src/lib/calculators/flooring';
import { calculateTiles } from '../src/lib/calculators/tile';
import { calculateWallpaper } from '../src/lib/calculators/wallpaper';
import { calculateRecessedLighting } from '../src/lib/calculators/recessedLighting';
import { calculateBathroomMirror } from '../src/lib/calculators/bathroomMirror';
import { calculateRoomSize } from '../src/lib/calculators/roomSize';
import { calculateCeilingFan } from '../src/lib/calculators/ceilingFan';
import { calculateChandelier } from '../src/lib/calculators/chandelier';
import { calculateTVSize } from '../src/lib/calculators/tvSize';
import { calculateBaseboard } from '../src/lib/calculators/baseboard';
import { calculateTrim } from '../src/lib/calculators/trim';
import { calculateCountertop } from '../src/lib/calculators/countertop';
import { calculateDrywall } from '../src/lib/calculators/drywall';
import { calculateCarpet } from '../src/lib/calculators/carpet';
import { calculateWallArea } from '../src/lib/calculators/wallArea';
import { calculateSquareFootage } from '../src/lib/calculators/squareFootage';
import {
  feetToMeters,
  metersToFeet,
  inchesToCm,
  cmToInches,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  ceilPurchasable,
} from '../src/lib/conversions';

describe('Strict Audit: Input Validation & Edge Cases', () => {
  it('Invalid / Negative / Zero inputs throw or are blocked', () => {
    // 1. Rug
    expect(() => calculateRugSize({ roomLength: 0, roomWidth: 10, arrangement: 'front', unit: 'imperial' })).toThrow();
    expect(() => calculateRugSize({ roomLength: -5, roomWidth: 10, arrangement: 'front', unit: 'imperial' })).toThrow();

    // 2. Curtain
    expect(() => calculateCurtainSize({
      windowWidth: 0, windowHeight: 50, fullnessFactor: 2, curtainStyle: 'pencil',
      desiredLength: 'floor', rodOverhang: 6, rodHeightAbove: 6, panelCount: 2, hemAllowance: 10, unit: 'imperial',
    })).toThrow();

    // 3. Wall Art
    expect(() => calculateWallArtSize({
      wallWidth: -10, wallHeight: 96, arrangement: 'single', proportion: 0.67, unit: 'imperial',
    })).toThrow();

    // 4. Paint
    expect(() => calculatePaint({
      totalWallWidth: 0, wallHeight: 9, doorsCount: 1, windowsCount: 1, coats: 2,
      coveragePerUnit: 350, includeCeiling: false, unit: 'imperial',
    })).toThrow();

    // 5. Flooring
    expect(() => calculateFlooring({
      roomLength: 10, roomWidth: 0, materialType: 'vinyl', wastePercent: 10, packageCoverage: 20, unit: 'imperial',
    })).toThrow();

    // 6. Tile
    expect(() => calculateTiles({
      surfaceLength: 10, surfaceWidth: 10, tileLength: 0, tileWidth: 12, groutSpacing: 0.125,
      wastePercent: 10, tilesPerBox: 8, unit: 'imperial',
    })).toThrow();

    // 7. Wallpaper
    expect(() => calculateWallpaper({
      wallWidth: -4, wallHeight: 8, numberOfWalls: 4, rollWidth: 20.5, rollLength: 33, patternRepeat: 21, unit: 'imperial',
    })).toThrow();

    // 8. Recessed Lighting
    expect(() => calculateRecessedLighting({
      roomLength: 10, roomWidth: 10, ceilingHeight: 0, spacingMethod: 'ceiling_rule', fixtureLumens: 750, unit: 'imperial',
    })).toThrow();

    // 9. Bathroom Mirror
    expect(() => calculateBathroomMirror({
      vanityWidth: 0, sinksCount: 1, mirrorToVanityRatio: 0.75, availableWallHeight: 40, unit: 'imperial',
    })).toThrow();

    // 10. Room Size
    expect(() => calculateRoomSize({ sections: [], unit: 'imperial' })).toThrow();

    // 11. Ceiling Fan
    expect(() => calculateCeilingFan({ roomLength: 0, roomWidth: 10, ceilingHeight: 8, unit: 'imperial' })).toThrow();

    // 12. Chandelier
    expect(() => calculateChandelier({ roomLength: -10, roomWidth: 10, ceilingHeight: 8, unit: 'imperial' })).toThrow();

    // 13. TV Size
    expect(() => calculateTVSize({ wallWidth: 0, wallHeight: 60, viewingDistance: 8, viewingAnglePreference: 'cinema', unit: 'imperial' })).toThrow();

    // 14. Baseboard
    expect(() => calculateBaseboard({ roomLength: 10, roomWidth: 10, doorCount: 0, doorWidth: 32, stockPieceLength: 0, wastePercent: 10, unit: 'imperial' })).toThrow();

    // 15. Trim
    expect(() => calculateTrim({ trimType: 'crown_molding', width: 0, stockPieceLength: 8, wastePercent: 10, unit: 'imperial' })).toThrow();

    // 16. Countertop
    expect(() => calculateCountertop({ sections: [], sinkCutoutsCount: 0, cooktopCutoutsCount: 0, materialThickness: '3cm', unit: 'imperial' })).toThrow();

    // 17. Drywall
    expect(() => calculateDrywall({ roomLength: 0, roomWidth: 10, wallHeight: 8, doorsCount: 0, windowsCount: 0, includeCeiling: false, sheetType: '4x8', wastePercent: 10, unit: 'imperial' })).toThrow();

    // 18. Carpet
    expect(() => calculateCarpet({ roomLength: 0, roomWidth: 10, rollWidth: 12, wastePercent: 10, unit: 'imperial' })).toThrow();

    // 19. Wall Area
    expect(() => calculateWallArea({ walls: [], doorsCount: 0, windowsCount: 0, unit: 'imperial' })).toThrow();

    // 20. Square Footage
    expect(() => calculateSquareFootage({ shapes: [], unit: 'imperial' })).toThrow();
  });
});

describe('Strict Audit: Purchasable Rounding & Decimal Accuracy', () => {
  it('Purchasable quantities always round UP to avoid shortages', () => {
    expect(ceilPurchasable(0.01)).toBe(1);
    expect(ceilPurchasable(1.0001)).toBe(2);
    expect(ceilPurchasable(5.0)).toBe(5);
    expect(ceilPurchasable(7.9)).toBe(8);
  });

  it('Paint container size: 5-gallon bucket vs 1-gallon vs quart', () => {
    const inputCommon = {
      totalWallWidth: 60,
      wallHeight: 10,
      doorsCount: 2,
      windowsCount: 2,
      coats: 2,
      coveragePerUnit: 350,
      includeCeiling: false,
      unit: 'imperial' as const,
    };

    // Net area: (60*10) - (2*21 + 2*15) = 600 - 72 = 528 sq ft. Total coat = 1056 sq ft.
    // Gallons needed = 1056 / 350 = 3.017 gallons.
    const res1Gal = calculatePaint({ ...inputCommon, containerSize: 1 });
    expect(res1Gal.cansToBuy).toBe(4); // ceil(3.017 / 1) = 4

    const res5Gal = calculatePaint({ ...inputCommon, containerSize: 5 });
    expect(res5Gal.cansToBuy).toBe(1); // ceil(3.017 / 5) = 1 bucket

    const resQuart = calculatePaint({ ...inputCommon, containerSize: 0.25 });
    expect(resQuart.cansToBuy).toBe(13); // ceil(3.017 / 0.25) = 13 quarts
  });

  it('Wallpaper pattern repeat: Large repeat (25 in) requires more rolls than zero repeat', () => {
    const base = {
      wallWidth: 16,
      wallHeight: 9,
      numberOfWalls: 1,
      rollWidth: 20.5,
      rollLength: 33,
      unit: 'imperial' as const,
    };
    const zeroRepeat = calculateWallpaper({ ...base, patternRepeat: 0 });
    const largeRepeat = calculateWallpaper({ ...base, patternRepeat: 25 });

    // With 25" repeat, drop cut length increases, yielding fewer drops per roll
    expect(largeRepeat.dropsPerRoll).toBeLessThanOrEqual(zeroRepeat.dropsPerRoll);
    expect(largeRepeat.rollsRequired).toBeGreaterThanOrEqual(zeroRepeat.rollsRequired);
  });

  it('TV Pythagorean aspect ratio dimensions match 16:9', () => {
    const tv = calculateTVSize({
      wallWidth: 100,
      wallHeight: 100,
      viewingDistance: 10,
      viewingAnglePreference: 'mixed',
      unit: 'imperial',
    });
    // Check Pythagorean: W^2 + H^2 = D^2
    const w = tv.idealScreenWidthInches;
    const h = tv.idealScreenHeightInches;
    const diag = Math.sqrt(w * w + h * h);
    expect(diag).toBeCloseTo(tv.recommendedDiagonalIdeal, 0);
    // Check ratio W / H close to 16/9 ≈ 1.7778
    expect(w / h).toBeCloseTo(16 / 9, 1);
  });
});

describe('Strict Audit: Unit Conversion Reciprocity', () => {
  it('Length conversions are reciprocal within machine precision', () => {
    const originalFt = 15.75;
    const toMeters = feetToMeters(originalFt);
    const backToFt = metersToFeet(toMeters);
    expect(backToFt).toBeCloseTo(originalFt, 6);

    const originalIn = 55.5;
    const toCm = inchesToCm(originalIn);
    const backToIn = cmToInches(toCm);
    expect(backToIn).toBeCloseTo(originalIn, 6);
  });

  it('Area conversions are reciprocal within machine precision', () => {
    const originalSqFt = 250.5;
    const toSqM = sqFeetToSqMeters(originalSqFt);
    const backToSqFt = sqMetersToSqFeet(toSqM);
    expect(backToSqFt).toBeCloseTo(originalSqFt, 6);
  });
});
