import { UnitSystem, metersToFeet } from '../conversions';

export interface CeilingFanInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  ceilingHeight: number; // ft or m
  roomType?: string;
  unit: UnitSystem;
}

export interface CeilingFanResult {
  roomAreaSqFt: number;
  roomAreaSqM: number;
  fanBladeSpanInches: string;
  fanBladeSpanCm: string;
  fansCount: number;
  mountingType: string;
  downrodLengthRecommendation: string;
  bladeClearanceGuidance: string;
}

export function calculateCeilingFan(input: CeilingFanInput): CeilingFanResult {
  const { roomLength, roomWidth, ceilingHeight, unit } = input;

  if (roomLength <= 0 || roomWidth <= 0 || ceilingHeight <= 0) {
    throw new Error('Room dimensions and ceiling height must be greater than zero.');
  }

  const lengthFt = unit === 'imperial' ? roomLength : metersToFeet(roomLength);
  const widthFt = unit === 'imperial' ? roomWidth : metersToFeet(roomWidth);
  const heightFt = unit === 'imperial' ? ceilingHeight : metersToFeet(ceilingHeight);

  const roomAreaFt = lengthFt * widthFt;
  const roomAreaM = roomAreaFt * 0.09290304;

  let spanInches = '';
  let spanCm = '';
  let fansCount = 1;

  if (roomAreaFt <= 75) {
    spanInches = '29" – 36"';
    spanCm = '74 – 91 cm';
  } else if (roomAreaFt <= 144) {
    spanInches = '42" – 44"';
    spanCm = '106 – 112 cm';
  } else if (roomAreaFt <= 225) {
    spanInches = '50" – 54"';
    spanCm = '127 – 137 cm';
  } else if (roomAreaFt <= 400) {
    spanInches = '56" – 60"';
    spanCm = '142 – 152 cm';
  } else {
    // Very large space (>400 sq ft)
    spanInches = '54" – 60" (or 65"+ single)';
    spanCm = '137 – 152 cm';
    fansCount = 2;
  }

  let mountingType = '';
  let downrod = '';

  if (heightFt < 8) {
    mountingType = 'Low Profile / Flush Mount (Hugger)';
    downrod = 'No downrod (flush mount directly to electrical box for safety)';
  } else if (heightFt <= 8.5) {
    mountingType = 'Standard Mount';
    downrod = 'Standard 3" to 4.5" downrod (included with most fans)';
  } else if (heightFt <= 9.5) {
    mountingType = 'Downrod Extended Mount';
    downrod = '6" downrod (positions blades at ~8 ft for optimal airflow)';
  } else if (heightFt <= 10.5) {
    mountingType = 'Downrod Extended Mount';
    downrod = '12" downrod';
  } else if (heightFt <= 11.5) {
    mountingType = 'Downrod Extended Mount';
    downrod = '18" downrod';
  } else if (heightFt <= 12.5) {
    mountingType = 'Downrod Extended Mount';
    downrod = '24" downrod';
  } else {
    const recRodIn = Math.round((heightFt - 8.5) * 12);
    mountingType = 'High Ceiling Downrod Mount';
    downrod = `${recRodIn}" downrod (maintains blades 8–9 ft from floor)`;
  }

  const bladeClearanceGuidance = `Building safety codes require fan blades to remain at least 7 ft (2.1 m) above the finished floor, with at least 18–24 inches (45–60 cm) of clearance from walls and sloped rafters.`;

  return {
    roomAreaSqFt: Number(roomAreaFt.toFixed(1)),
    roomAreaSqM: Number(roomAreaM.toFixed(1)),
    fanBladeSpanInches: spanInches,
    fanBladeSpanCm: spanCm,
    fansCount,
    mountingType,
    downrodLengthRecommendation: downrod,
    bladeClearanceGuidance,
  };
}
