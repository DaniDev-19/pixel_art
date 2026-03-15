/**
 * Tipos y Interfaces unificados para Pixel Art Studio
 */

export type ColorCode = string;
export type PixelColor = ColorCode | null;
export type PixelGrid = PixelColor[][];

export interface PixelCanvasProps {
  gridSize: number;
  cellSize: number;
  currentColor: ColorCode;
}

export interface AppState {
  color: ColorCode;
  gridSize: number;
  cellSize: number;
}
