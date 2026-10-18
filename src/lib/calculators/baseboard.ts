import { UnitSystem, ceilPurchasable } from '../conversions';

export interface BaseboardInput {
  roomLength: number; // ft or m
  roomWidth: number; // ft or m
  doorCount: number;
  doorWidth: number; // inches or cm (default 32 in or 80 cm)
  stockPieceLength: number; // ft or m (e.g. 8, 12, 16 ft or 2.4, 3.6 m)
  wastePercent: number; // 10, 15
  unit: UnitSystem;
}

export interface BaseboardResult {
  grossPerimeter: number;
  deductedOpeningsLength: number;
  netBaseboardLength: number;
  totalWithWasteLength: number;
  stockPiecesToBuy: number;
  totalPurchasedLength: number;
  leftoverLength: number;
  notes: string;
}

export function calculateBaseboard(input: BaseboardInput): BaseboardResult {
  const {
    roomLength,
    roomWidth,
    doorCount,
    doorWidth,
    stockPieceLength,
    wastePercent,
    unit,
  } = input;

  if (roomLength <= 0 || roomWidth <= 0) {
    throw new Error('Room dimensions must be greater than zero.');
  }
  if (stockPieceLength <= 0) {
    throw new Error('Stock piece length must be greater than zero.');
  }

  const grossPerimeter = 2 * (roomLength + roomWidth);

  // Convert door width from inches or cm to ft or meters
  const singleDoorOpening = unit === 'imperial' ? doorWidth / 12 : doorWidth / 100;
  const deductedOpeningsLength = Math.min(grossPerimeter * 0.7, doorCount * singleDoorOpening);
  const netBaseboardLength = Math.max(0, grossPerimeter - deductedOpeningsLength);

  const totalWithWasteLength = netBaseboardLength * (1 + wastePercent / 100);
  const stockPiecesToBuy = ceilPurchasable(totalWithWasteLength / stockPieceLength);
  const totalPurchasedLength = stockPiecesToBuy * stockPieceLength;
  const leftoverLength = Math.max(0, totalPurchasedLength - netBaseboardLength);

  const unitLabel = unit === 'imperial' ? 'ft' : 'm';
  const notes = `Purchasing ${stockPiecesToBuy} stock boards (${stockPieceLength} ${unitLabel} each) accommodates miter cuts, outside corners, and scarf joints with a ${wastePercent}% safety buffer.`;

  return {
    grossPerimeter: Number(grossPerimeter.toFixed(2)),
    deductedOpeningsLength: Number(deductedOpeningsLength.toFixed(2)),
    netBaseboardLength: Number(netBaseboardLength.toFixed(2)),
    totalWithWasteLength: Number(totalWithWasteLength.toFixed(2)),
    stockPiecesToBuy,
    totalPurchasedLength: Number(totalPurchasedLength.toFixed(2)),
    leftoverLength: Number(leftoverLength.toFixed(2)),
    notes,
  };
}
