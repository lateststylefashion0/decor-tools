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

describe('1. Rug Size Calculator', () => {
  it('Normal Case: Standard living room with front legs on rug', () => {
    const result = calculateRugSize({
      roomLength: 16,
      roomWidth: 12,
      arrangement: 'front',
      unit: 'imperial',
    });
    expect(result.roomArea).toBe(192);
    expect(result.bestFit.nameImperial).toBe('8 ft × 10 ft');
    expect(result.coveragePercent).toBeGreaterThan(35);
  });

  it('Boundary Case: Small compact room', () => {
    const result = calculateRugSize({
      roomLength: 8,
      roomWidth: 8,
      arrangement: 'center',
      unit: 'imperial',
    });
    expect(result.bestFit.areaSqFt).toBeLessThan(64);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateRugSize({
      roomLength: 4.88, // ~16 ft
      roomWidth: 3.66, // ~12 ft
      arrangement: 'front',
      unit: 'metric',
    });
    expect(result.roomArea).toBeCloseTo(17.86, 1);
    expect(result.bestFit.nameMetric).toBe('2.4 m × 3.0 m');
  });
});

describe('2. Curtain Size Calculator', () => {
  it('Normal Case: 60x72 in window, 2.0x fullness, floor length', () => {
    const result = calculateCurtainSize({
      windowWidth: 60,
      windowHeight: 72,
      fullnessFactor: 2.0,
      curtainStyle: 'pencil',
      desiredLength: 'floor',
      rodOverhang: 6,
      rodHeightAbove: 6,
      panelCount: 2,
      hemAllowance: 10,
      unit: 'imperial',
    });
    expect(result.totalRodWidth).toBe(72);
    expect(result.totalFabricWidth).toBe(144);
    expect(result.singlePanelWidth).toBe(72);
    expect(result.finishedCurtainLength).toBe(101.5);
    expect(result.cutFabricLength).toBe(111.5);
  });

  it('Boundary Case: Single narrow window, 1 panel, sill length', () => {
    const result = calculateCurtainSize({
      windowWidth: 24,
      windowHeight: 36,
      fullnessFactor: 1.5,
      curtainStyle: 'eyelet',
      desiredLength: 'sill',
      rodOverhang: 4,
      rodHeightAbove: 4,
      panelCount: 1,
      hemAllowance: 8,
      unit: 'imperial',
    });
    expect(result.totalRodWidth).toBe(32);
    expect(result.singlePanelWidth).toBe(48);
    expect(result.finishedCurtainLength).toBe(39.5);
  });

  it('Unit Conversion Case: Metric measurements in cm', () => {
    const result = calculateCurtainSize({
      windowWidth: 150,
      windowHeight: 180,
      fullnessFactor: 2.0,
      curtainStyle: 'pencil',
      desiredLength: 'below_sill',
      rodOverhang: 15,
      rodHeightAbove: 15,
      panelCount: 2,
      hemAllowance: 25,
      unit: 'metric',
    });
    expect(result.totalRodWidth).toBe(180);
    expect(result.totalFabricWidth).toBe(360);
    expect(result.finishedCurtainLength).toBe(210);
  });
});

describe('3. Wall Art Size Calculator', () => {
  it('Normal Case: 84" sofa on 120" wall, 2 pieces', () => {
    const result = calculateWallArtSize({
      wallWidth: 120,
      wallHeight: 96,
      furnitureWidth: 84,
      arrangement: 'two',
      proportion: 0.67,
      unit: 'imperial',
    });
    expect(result.totalArtworkWidth).toBeCloseTo(56.3, 1);
    expect(result.pieceCount).toBe(2);
    expect(result.singlePieceWidth).toBeCloseTo((56.28 - 2.5) / 2, 1);
  });

  it('Boundary Case: Blank wall without furniture, single large art', () => {
    const result = calculateWallArtSize({
      wallWidth: 100,
      wallHeight: 100,
      arrangement: 'single',
      proportion: 0.60,
      unit: 'imperial',
    });
    expect(result.totalArtworkWidth).toBe(60);
    expect(result.pieceCount).toBe(1);
  });

  it('Unit Conversion Case: Metric measurements in cm', () => {
    const result = calculateWallArtSize({
      wallWidth: 300,
      wallHeight: 250,
      furnitureWidth: 200,
      arrangement: 'three',
      proportion: 0.70,
      unit: 'metric',
    });
    expect(result.totalArtworkWidth).toBe(140);
    expect(result.pieceCount).toBe(3);
  });
});

describe('4. Paint Calculator', () => {
  it('Normal Case: 12x12 room, 9 ft ceiling, 2 coats, 1 door, 2 windows', () => {
    const result = calculatePaint({
      totalWallWidth: 48,
      wallHeight: 9,
      doorsCount: 1,
      windowsCount: 2,
      coats: 2,
      coveragePerUnit: 350,
      includeCeiling: false,
      unit: 'imperial',
    });
    expect(result.grossWallArea).toBe(432);
    expect(result.deductedArea).toBe(51); // 21 + 30
    expect(result.netWallArea).toBe(381);
    expect(result.totalCoatArea).toBe(762);
    expect(result.cansToBuy).toBe(3); // ceil(762 / 350 = 2.177)
  });

  it('Boundary Case: Single accent wall with no openings', () => {
    const result = calculatePaint({
      totalWallWidth: 10,
      wallHeight: 8,
      doorsCount: 0,
      windowsCount: 0,
      coats: 1,
      coveragePerUnit: 400,
      includeCeiling: false,
      unit: 'imperial',
    });
    expect(result.grossWallArea).toBe(80);
    expect(result.netWallArea).toBe(80);
    expect(result.cansToBuy).toBe(1);
  });

  it('Unit Conversion Case: Metric room with ceiling in meters', () => {
    const result = calculatePaint({
      totalWallWidth: 14,
      wallHeight: 2.6,
      doorsCount: 1,
      windowsCount: 1,
      coats: 2,
      coveragePerUnit: 10,
      includeCeiling: true,
      roomLength: 4,
      roomWidth: 3,
      unit: 'metric',
    });
    expect(result.grossWallArea).toBe(36.4);
    expect(result.ceilingArea).toBe(12);
    expect(result.cansToBuy).toBeGreaterThan(0);
  });
});

describe('5. Flooring Calculator', () => {
  it('Normal Case: 16x12 ft room with 10% waste and 24 sq ft boxes', () => {
    const result = calculateFlooring({
      roomLength: 16,
      roomWidth: 12,
      materialType: 'vinyl',
      wastePercent: 10,
      packageCoverage: 24,
      unit: 'imperial',
    });
    expect(result.floorArea).toBe(192);
    expect(result.wasteArea).toBeCloseTo(19.2, 1);
    expect(result.totalAreaToPurchase).toBeCloseTo(211.2, 1);
    expect(result.boxesRequired).toBe(9); // ceil(211.2 / 24)
    expect(result.totalBoxCoverage).toBe(216);
  });

  it('Boundary Case: High waste allowance (15%) for herringbone', () => {
    const result = calculateFlooring({
      roomLength: 20,
      roomWidth: 15,
      materialType: 'hardwood',
      wastePercent: 15,
      packageCoverage: 20,
      unit: 'imperial',
    });
    expect(result.floorArea).toBe(300);
    expect(result.totalAreaToPurchase).toBe(345);
    expect(result.boxesRequired).toBe(18);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateFlooring({
      roomLength: 5,
      roomWidth: 4,
      materialType: 'laminate',
      wastePercent: 10,
      packageCoverage: 2.2,
      unit: 'metric',
    });
    expect(result.floorArea).toBe(20);
    expect(result.totalAreaToPurchase).toBe(22);
    expect(result.boxesRequired).toBe(10);
  });
});

describe('6. Tile Calculator', () => {
  it('Normal Case: 10x8 ft surface with 12x24" tiles, 10% waste, 8 per box', () => {
    const result = calculateTiles({
      surfaceLength: 10,
      surfaceWidth: 8,
      tileLength: 12,
      tileWidth: 24,
      groutSpacing: 0,
      wastePercent: 10,
      tilesPerBox: 8,
      unit: 'imperial',
    });
    expect(result.surfaceArea).toBe(80);
    expect(result.singleTileArea).toBe(2);
    expect(result.netTilesNeeded).toBe(40);
    expect(result.wasteTiles).toBe(4);
    expect(result.totalTilesNeeded).toBe(44);
    expect(result.boxesRequired).toBe(6);
  });

  it('Boundary Case: Small backsplash with grout lines', () => {
    const result = calculateTiles({
      surfaceLength: 8,
      surfaceWidth: 1.5,
      tileLength: 3,
      tileWidth: 6,
      groutSpacing: 0.125,
      wastePercent: 15,
      tilesPerBox: 40,
      unit: 'imperial',
    });
    expect(result.surfaceArea).toBe(12);
    expect(result.boxesRequired).toBeGreaterThan(0);
  });

  it('Unit Conversion Case: Metric floor with 30x60 cm tiles', () => {
    const result = calculateTiles({
      surfaceLength: 3,
      surfaceWidth: 2,
      tileLength: 30,
      tileWidth: 60,
      groutSpacing: 2, // 2mm
      wastePercent: 10,
      tilesPerBox: 6,
      unit: 'metric',
    });
    expect(result.surfaceArea).toBe(6);
    expect(result.boxesRequired).toBeGreaterThan(0);
  });
});

describe('7. Wallpaper Calculator', () => {
  it('Normal Case: 12 ft wall, 8 ft tall, 20.5" x 33 ft roll, 21" pattern repeat', () => {
    const result = calculateWallpaper({
      wallWidth: 12,
      wallHeight: 8,
      numberOfWalls: 1,
      rollWidth: 20.5,
      rollLength: 33,
      patternRepeat: 21,
      unit: 'imperial',
    });
    expect(result.totalWallArea).toBe(96);
    expect(result.dropsPerRoll).toBe(3);
    expect(result.totalDropsRequired).toBe(8);
    expect(result.rollsRequired).toBe(3);
  });

  it('Boundary Case: No pattern repeat (random match)', () => {
    const result = calculateWallpaper({
      wallWidth: 10,
      wallHeight: 8,
      numberOfWalls: 1,
      rollWidth: 20.5,
      rollLength: 33,
      patternRepeat: 0,
      unit: 'imperial',
    });
    expect(result.dropsPerRoll).toBe(3);
    expect(result.rollsRequired).toBeGreaterThan(0);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateWallpaper({
      wallWidth: 4,
      wallHeight: 2.5,
      numberOfWalls: 2,
      rollWidth: 53,
      rollLength: 10.05,
      patternRepeat: 32,
      unit: 'metric',
    });
    expect(result.totalWallArea).toBe(20);
    expect(result.rollsRequired).toBeGreaterThan(0);
  });
});

describe('8. Recessed Lighting Calculator', () => {
  it('Normal Case: 16x12 ft room, 9 ft ceiling, 750 lumens fixture', () => {
    const result = calculateRecessedLighting({
      roomLength: 16,
      roomWidth: 12,
      ceilingHeight: 9,
      spacingMethod: 'ceiling_rule',
      fixtureLumens: 750,
      unit: 'imperial',
    });
    expect(result.roomArea).toBe(192);
    expect(result.recommendedCount).toBeGreaterThan(0);
    expect(result.spacingBetweenFixtures).toBeGreaterThan(0);
  });

  it('Boundary Case: Target lumens mode in high illumination kitchen', () => {
    const result = calculateRecessedLighting({
      roomLength: 14,
      roomWidth: 10,
      ceilingHeight: 8,
      spacingMethod: 'target_lumens',
      targetIlluminationFc: 40,
      fixtureLumens: 650,
      unit: 'imperial',
    });
    expect(result.recommendedCount).toBeGreaterThan(4);
  });

  it('Unit Conversion Case: Metric room in meters and lux', () => {
    const result = calculateRecessedLighting({
      roomLength: 5,
      roomWidth: 4,
      ceilingHeight: 2.7,
      spacingMethod: 'target_lumens',
      targetIlluminationFc: 250, // 250 lux
      fixtureLumens: 800,
      unit: 'metric',
    });
    expect(result.roomArea).toBe(20);
    expect(result.recommendedCount).toBeGreaterThan(0);
  });
});

describe('9. Bathroom Mirror Size Calculator', () => {
  it('Normal Case: 48" vanity, single sink', () => {
    const result = calculateBathroomMirror({
      vanityWidth: 48,
      sinksCount: 1,
      mirrorToVanityRatio: 0.75,
      availableWallHeight: 42,
      unit: 'imperial',
    });
    expect(result.singleMirrorWidth).toBe(36);
    expect(result.singleMirrorHeight).toBeLessThanOrEqual(42);
  });

  it('Boundary Case: 72" double vanity with two mirrors', () => {
    const result = calculateBathroomMirror({
      vanityWidth: 72,
      sinksCount: 2,
      mirrorToVanityRatio: 0.75,
      availableWallHeight: 45,
      unit: 'imperial',
    });
    expect(result.dualMirrorWidth).toBeDefined();
    expect(result.dualMirrorWidth).toBeLessThan(36);
    expect(result.gapBetweenDualMirrors).toBe(4);
  });

  it('Unit Conversion Case: Metric vanity in cm', () => {
    const result = calculateBathroomMirror({
      vanityWidth: 120,
      sinksCount: 1,
      mirrorToVanityRatio: 0.75,
      availableWallHeight: 100,
      unit: 'metric',
    });
    expect(result.singleMirrorWidth).toBe(90);
  });
});

describe('10. Room Size Calculator', () => {
  it('Normal Case: 15x12 ft room with 9 ft ceiling', () => {
    const result = calculateRoomSize({
      sections: [{ length: 15, width: 12 }],
      roomHeight: 9,
      unit: 'imperial',
    });
    expect(result.totalAreaSqFt).toBe(180);
    expect(result.totalPerimeterFt).toBe(54);
    expect(result.totalVolumeCuFt).toBe(1620);
    expect(result.totalAreaSqYd).toBe(20);
  });

  it('Boundary Case: Multiple rectangular sections (L-shaped)', () => {
    const result = calculateRoomSize({
      sections: [
        { length: 12, width: 10, name: 'Main' },
        { length: 6, width: 4, name: 'Alcove' },
      ],
      unit: 'imperial',
    });
    expect(result.totalAreaSqFt).toBe(144);
    expect(result.sectionDetails.length).toBe(2);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateRoomSize({
      sections: [{ length: 4, width: 3 }],
      roomHeight: 2.5,
      unit: 'metric',
    });
    expect(result.totalAreaSqM).toBe(12);
    expect(result.totalPerimeterM).toBe(14);
    expect(result.totalVolumeCuM).toBe(30);
  });
});

describe('11. Ceiling Fan Size Calculator', () => {
  it('Normal Case: 14x14 ft room (196 sq ft) with 10 ft ceiling', () => {
    const result = calculateCeilingFan({
      roomLength: 14,
      roomWidth: 14,
      ceilingHeight: 10,
      unit: 'imperial',
    });
    expect(result.roomAreaSqFt).toBe(196);
    expect(result.fanBladeSpanInches).toBe('50" – 54"');
    expect(result.downrodLengthRecommendation).toContain('12"');
  });

  it('Boundary Case: Small room (60 sq ft) with 8 ft low ceiling', () => {
    const result = calculateCeilingFan({
      roomLength: 8,
      roomWidth: 7.5,
      ceilingHeight: 7.8,
      unit: 'imperial',
    });
    expect(result.fanBladeSpanInches).toBe('29" – 36"');
    expect(result.mountingType).toContain('Flush Mount');
  });

  it('Unit Conversion Case: Metric dimensions in meters', () => {
    const result = calculateCeilingFan({
      roomLength: 4.5,
      roomWidth: 4.5,
      ceilingHeight: 2.7,
      unit: 'metric',
    });
    expect(result.roomAreaSqM).toBeCloseTo(20.3, 1);
    expect(result.fansCount).toBe(1);
  });
});

describe('12. Chandelier Size Calculator', () => {
  it('Normal Case: 14x12 ft room with 9 ft ceiling', () => {
    const result = calculateChandelier({
      roomLength: 14,
      roomWidth: 12,
      ceilingHeight: 9,
      unit: 'imperial',
    });
    expect(result.roomChandelierDiameterInches).toBe(26);
    expect(result.chandelierHeightMinInches).toBe(23);
    expect(result.chandelierHeightMaxInches).toBe(27);
  });

  it('Boundary Case: Sizing over 40" dining table', () => {
    const result = calculateChandelier({
      roomLength: 14,
      roomWidth: 12,
      ceilingHeight: 9,
      diningTableWidth: 40,
      unit: 'imperial',
    });
    expect(result.tableChandelierDiameterInches).toBe(24);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateChandelier({
      roomLength: 4.27, // ~14 ft
      roomWidth: 3.66, // ~12 ft
      ceilingHeight: 2.74, // ~9 ft
      unit: 'metric',
    });
    expect(result.roomChandelierDiameterInches).toBe(26);
    expect(result.roomChandelierDiameterCm).toBe(66);
  });
});

describe('13. TV Size Calculator', () => {
  it('Normal Case: 9 ft viewing distance with 16:9 cinema viewing angle', () => {
    const result = calculateTVSize({
      wallWidth: 96,
      wallHeight: 96,
      viewingDistance: 9,
      viewingAnglePreference: 'cinema',
      unit: 'imperial',
    });
    expect(result.recommendedDiagonalIdeal).toBeGreaterThan(70);
    expect(result.idealScreenWidthInches).toBeGreaterThan(0);
    expect(result.idealScreenHeightInches).toBeGreaterThan(0);
  });

  it('Boundary Case: Small wall constraint', () => {
    const result = calculateTVSize({
      wallWidth: 40,
      wallHeight: 30,
      viewingDistance: 6,
      viewingAnglePreference: 'smpte',
      unit: 'imperial',
    });
    const fitting = result.fittingCommercialSizes.filter(s => s.fitsWall);
    expect(fitting.length).toBeLessThan(result.fittingCommercialSizes.length);
  });

  it('Unit Conversion Case: Metric distance in meters', () => {
    const result = calculateTVSize({
      wallWidth: 250,
      wallHeight: 200,
      viewingDistance: 2.74, // ~9 ft
      viewingAnglePreference: 'mixed',
      unit: 'metric',
    });
    expect(result.idealScreenWidthCm).toBeGreaterThan(0);
  });
});

describe('14. Baseboard Calculator', () => {
  it('Normal Case: 16x14 ft room, 2 doors (32"), 12 ft stock pieces, 10% waste', () => {
    const result = calculateBaseboard({
      roomLength: 16,
      roomWidth: 14,
      doorCount: 2,
      doorWidth: 32,
      stockPieceLength: 12,
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.grossPerimeter).toBe(60);
    expect(result.netBaseboardLength).toBeCloseTo(54.67, 1);
    expect(result.stockPiecesToBuy).toBe(6);
  });

  it('Boundary Case: Single wall without doors', () => {
    const result = calculateBaseboard({
      roomLength: 10,
      roomWidth: 10,
      doorCount: 0,
      doorWidth: 32,
      stockPieceLength: 8,
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.netBaseboardLength).toBe(40);
    expect(result.stockPiecesToBuy).toBe(6);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateBaseboard({
      roomLength: 5,
      roomWidth: 4,
      doorCount: 1,
      doorWidth: 80, // cm
      stockPieceLength: 2.4, // meters
      wastePercent: 10,
      unit: 'metric',
    });
    expect(result.grossPerimeter).toBe(18);
    expect(result.netBaseboardLength).toBeCloseTo(17.2, 1);
    expect(result.stockPiecesToBuy).toBeGreaterThan(0);
  });
});

describe('15. Trim Calculator', () => {
  it('Normal Case: Door casing for 3 doors, 8 ft stock piece', () => {
    const result = calculateTrim({
      trimType: 'door_casing',
      width: 36,
      height: 80,
      openingCount: 3,
      stockPieceLength: 8,
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.totalLinearLengthNeeded).toBeCloseTo(50.5, 1);
    expect(result.stockPiecesRequired).toBe(7);
  });

  it('Boundary Case: Crown molding for 50 ft perimeter with 15% waste', () => {
    const result = calculateTrim({
      trimType: 'crown_molding',
      width: 50,
      stockPieceLength: 12,
      wastePercent: 15,
      unit: 'imperial',
    });
    expect(result.totalLinearLengthNeeded).toBe(50);
    expect(result.totalWithWaste).toBe(57.5);
    expect(result.stockPiecesRequired).toBe(5);
  });

  it('Unit Conversion Case: Metric window casing', () => {
    const result = calculateTrim({
      trimType: 'window_casing',
      width: 90, // cm
      height: 120, // cm
      openingCount: 2,
      stockPieceLength: 2.4, // m
      wastePercent: 10,
      unit: 'metric',
    });
    expect(result.stockPiecesRequired).toBeGreaterThan(0);
  });
});

describe('16. Countertop Calculator', () => {
  it('Normal Case: 120x25.5" run, 72x36" island, 4" backsplash, 1 sink', () => {
    const result = calculateCountertop({
      sections: [
        { length: 120, depth: 25.5 },
        { length: 72, depth: 36 },
      ],
      backsplashHeight: 4,
      sinkCutoutsCount: 1,
      cooktopCutoutsCount: 0,
      materialThickness: '3cm',
      unit: 'imperial',
    });
    expect(result.grossSurfaceArea).toBeCloseTo(39.25, 1);
    expect(result.netSurfaceArea).toBeCloseTo(35.08, 1);
    expect(result.estimatedFabricationSlabs).toBe(2);
  });

  it('Boundary Case: Small vanity top without cutouts', () => {
    const result = calculateCountertop({
      sections: [{ length: 48, depth: 22 }],
      sinkCutoutsCount: 0,
      cooktopCutoutsCount: 0,
      materialThickness: '2cm',
      unit: 'imperial',
    });
    expect(result.grossSurfaceArea).toBeCloseTo(7.33, 1);
    expect(result.estimatedFabricationSlabs).toBe(1);
  });

  it('Unit Conversion Case: Metric kitchen in cm', () => {
    const result = calculateCountertop({
      sections: [{ length: 300, depth: 65 }],
      backsplashHeight: 10,
      sinkCutoutsCount: 1,
      cooktopCutoutsCount: 1,
      materialThickness: '3cm',
      unit: 'metric',
    });
    expect(result.grossSurfaceArea).toBe(1.95);
    expect(result.estimatedFabricationSlabs).toBeGreaterThan(0);
  });
});

describe('17. Drywall Calculator', () => {
  it('Normal Case: 14x12 room, 8 ft height, 1 door, 2 windows, 4x8 sheets', () => {
    const result = calculateDrywall({
      roomLength: 14,
      roomWidth: 12,
      wallHeight: 8,
      doorsCount: 1,
      windowsCount: 2,
      includeCeiling: true,
      sheetType: '4x8',
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.grossWallArea).toBe(416);
    expect(result.netWallArea).toBe(365);
    expect(result.ceilingArea).toBe(168);
    expect(result.sheetsToBuy).toBe(19);
  });

  it('Boundary Case: Single partition wall without ceiling', () => {
    const result = calculateDrywall({
      roomLength: 10,
      roomWidth: 0.5,
      wallHeight: 8,
      doorsCount: 0,
      windowsCount: 0,
      includeCeiling: false,
      sheetType: '4x8',
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.ceilingArea).toBe(0);
    expect(result.sheetsToBuy).toBeGreaterThan(0);
  });

  it('Unit Conversion Case: Metric room with 1200x2400 mm sheets', () => {
    const result = calculateDrywall({
      roomLength: 4,
      roomWidth: 3,
      wallHeight: 2.5,
      doorsCount: 1,
      windowsCount: 1,
      includeCeiling: false,
      sheetType: 'metric_12x24',
      wastePercent: 10,
      unit: 'metric',
    });
    expect(result.singleSheetArea).toBe(2.88);
    expect(result.sheetsToBuy).toBeGreaterThan(0);
  });
});

describe('18. Carpet Calculator', () => {
  it('Normal Case: 15x11 ft room, 12 ft roll, 10% waste', () => {
    const result = calculateCarpet({
      roomLength: 15,
      roomWidth: 11,
      rollWidth: 12,
      wastePercent: 10,
      unit: 'imperial',
    });
    expect(result.floorAreaSqFt).toBe(165);
    expect(result.floorAreaSqYards).toBeCloseTo(18.33, 1);
    expect(result.linearRollLengthNeeded).toBe(16.5);
  });

  it('Boundary Case: Square room matching exact roll width', () => {
    const result = calculateCarpet({
      roomLength: 12,
      roomWidth: 12,
      rollWidth: 12,
      wastePercent: 5,
      unit: 'imperial',
    });
    expect(result.floorAreaSqFt).toBe(144);
    expect(result.linearRollLengthNeeded).toBe(12.6);
  });

  it('Unit Conversion Case: Metric room in meters', () => {
    const result = calculateCarpet({
      roomLength: 5,
      roomWidth: 4,
      rollWidth: 4,
      wastePercent: 10,
      unit: 'metric',
    });
    expect(result.floorAreaSqM).toBe(20);
    expect(result.linearRollLengthNeeded).toBe(5.5);
  });
});

describe('19. Wall Area Calculator', () => {
  it('Normal Case: 4 walls, 1 door, 2 windows', () => {
    const result = calculateWallArea({
      walls: [
        { width: 14, height: 9 },
        { width: 12, height: 9 },
        { width: 14, height: 9 },
        { width: 12, height: 9 },
      ],
      doorsCount: 1,
      windowsCount: 2,
      unit: 'imperial',
    });
    expect(result.grossWallAreaSqFt).toBe(468);
    expect(result.openingsAreaSqFt).toBe(44);
    expect(result.netWallAreaSqFt).toBe(424);
  });

  it('Boundary Case: Single accent wall with no openings', () => {
    const result = calculateWallArea({
      walls: [{ width: 15, height: 10 }],
      doorsCount: 0,
      windowsCount: 0,
      unit: 'imperial',
    });
    expect(result.grossWallAreaSqFt).toBe(150);
    expect(result.netWallAreaSqFt).toBe(150);
  });

  it('Unit Conversion Case: Metric walls in meters', () => {
    const result = calculateWallArea({
      walls: [
        { width: 4, height: 2.5 },
        { width: 3, height: 2.5 },
      ],
      doorsCount: 1,
      windowsCount: 0,
      unit: 'metric',
    });
    expect(result.grossWallAreaSqM).toBe(17.5);
    expect(result.netWallAreaSqM).toBeLessThan(17.5);
  });
});

describe('20. Square Footage Calculator', () => {
  it('Normal Case: Rectangle + Triangle - Deduction', () => {
    const result = calculateSquareFootage({
      shapes: [
        { type: 'rectangle', dim1: 20, dim2: 15, name: 'Living Room' },
        { type: 'triangle', dim1: 8, dim2: 4, name: 'Bay Window' },
        { type: 'deduction', dim1: 10, dim2: 3.5, name: 'Stair Opening' },
      ],
      unit: 'imperial',
    });
    expect(result.subtotalArea).toBe(316); // 300 + 16
    expect(result.deductionArea).toBe(35);
    expect(result.netAreaSqFt).toBe(281);
    expect(result.netAreaSqYards).toBeCloseTo(31.22, 1);
  });

  it('Boundary Case: Circular area', () => {
    const result = calculateSquareFootage({
      shapes: [
        { type: 'circle', dim1: 10, name: 'Rotunda' }, // r = 10 -> pi * 100 = 314.16
      ],
      unit: 'imperial',
    });
    expect(result.netAreaSqFt).toBeCloseTo(314.16, 1);
  });

  it('Unit Conversion Case: Metric shapes in meters', () => {
    const result = calculateSquareFootage({
      shapes: [
        { type: 'rectangle', dim1: 6, dim2: 5, name: 'Room' },
      ],
      unit: 'metric',
    });
    expect(result.netAreaSqM).toBe(30);
    expect(result.netAreaSqFt).toBeCloseTo(322.92, 1);
  });
});
