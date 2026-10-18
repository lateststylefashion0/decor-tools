/**
 * Unit conversion and precision formatting utilities for DecorTools.
 * Strictly adheres to standard metric-imperial physical constants.
 */

export type { UnitSystem } from '../types/calculator';

export const CONSTANTS = {
  INCHES_PER_FOOT: 12,
  CM_PER_INCH: 2.54,
  METERS_PER_FOOT: 0.3048,
  SQ_METERS_PER_SQ_FOOT: 0.09290304,
  SQ_FEET_PER_SQ_METER: 1 / 0.09290304, // ~10.7639104
  SQ_FEET_PER_SQ_YARD: 9,
  SQ_METERS_PER_SQ_YARD: 9 * 0.09290304,
  CU_METERS_PER_CU_FOOT: 0.028316846592,
  CU_FEET_PER_CU_METER: 1 / 0.028316846592,
  LITERS_PER_US_GALLON: 3.785411784,
  SQ_FEET_PER_ACRE: 43560,
  SQ_METERS_PER_ACRE: 43560 * 0.09290304,
};

// Length conversions
export function feetToMeters(feet: number): number {
  return feet * CONSTANTS.METERS_PER_FOOT;
}

export function metersToFeet(meters: number): number {
  return meters / CONSTANTS.METERS_PER_FOOT;
}

export function inchesToCm(inches: number): number {
  return inches * CONSTANTS.CM_PER_INCH;
}

export function cmToInches(cm: number): number {
  return cm / CONSTANTS.CM_PER_INCH;
}

export function inchesToMeters(inches: number): number {
  return (inches * CONSTANTS.CM_PER_INCH) / 100;
}

export function metersToInches(meters: number): number {
  return (meters * 100) / CONSTANTS.CM_PER_INCH;
}

export function feetToInches(feet: number): number {
  return feet * CONSTANTS.INCHES_PER_FOOT;
}

export function inchesToFeet(inches: number): number {
  return inches / CONSTANTS.INCHES_PER_FOOT;
}

// Area conversions
export function sqFeetToSqMeters(sqFeet: number): number {
  return sqFeet * CONSTANTS.SQ_METERS_PER_SQ_FOOT;
}

export function sqMetersToSqFeet(sqMeters: number): number {
  return sqMeters * CONSTANTS.SQ_FEET_PER_SQ_METER;
}

export function sqFeetToSqYards(sqFeet: number): number {
  return sqFeet / CONSTANTS.SQ_FEET_PER_SQ_YARD;
}

export function sqMetersToSqYards(sqMeters: number): number {
  return sqFeetToSqYards(sqMetersToSqFeet(sqMeters));
}

export function sqFeetToAcres(sqFeet: number): number {
  return sqFeet / CONSTANTS.SQ_FEET_PER_ACRE;
}

export function sqMetersToAcres(sqMeters: number): number {
  return sqMeters / CONSTANTS.SQ_METERS_PER_ACRE;
}

// Volume conversions
export function cuFeetToCuMeters(cuFeet: number): number {
  return cuFeet * CONSTANTS.CU_METERS_PER_CU_FOOT;
}

export function cuMetersToCuFeet(cuMeters: number): number {
  return cuMeters * CONSTANTS.CU_FEET_PER_CU_METER;
}

// Liquid volume
export function gallonsToLiters(gallons: number): number {
  return gallons * CONSTANTS.LITERS_PER_US_GALLON;
}

export function litersToGallons(liters: number): number {
  return liters / CONSTANTS.LITERS_PER_US_GALLON;
}

/**
 * Format a numeric value to a clean decimal display (e.g. 12.34 or 12).
 */
export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  const rounded = Number(val.toFixed(decimals));
  // If it's a whole integer, display without decimal places
  if (rounded % 1 === 0) {
    return rounded.toLocaleString('en-US');
  }
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: Math.min(1, decimals),
    maximumFractionDigits: decimals,
  });
}

/**
 * Always rounds upward for purchasable stock/packages (can never purchase fractional cans, rolls, boxes).
 */
export function ceilPurchasable(val: number): number {
  if (isNaN(val) || !isFinite(val) || val <= 0) return 0;
  return Math.ceil(val);
}
