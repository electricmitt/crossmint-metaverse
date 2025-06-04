import { AstralObject, Coordinates, ObjectType, Color, Direction, Polyanet, Soloon, Cometh } from '../models/types';

export type Shape = 'CROSS' | 'DIAGONAL' | 'CUSTOM';

export interface ShapeConfig {
  size: number;
  color?: Color;
  direction?: Direction;
  customPattern?: (row: number, col: number) => ObjectType | null;
}

export class ShapeBuilder {
  static generateShape(shape: Shape, config: ShapeConfig): AstralObject[] {
    switch (shape) {
      case 'CROSS':
        return this.buildCross(config.size);
      case 'DIAGONAL':
        return this.buildDiagonal(config.size);
      case 'CUSTOM':
        if (config.customPattern) {
          return this.buildCustom(config.size, config.customPattern, config);
        }
        throw new Error('Custom pattern function required for CUSTOM shape');
      default:
        throw new Error('Unsupported shape type');
    }
  }

  private static buildCross(size: number): AstralObject[] {
    const objects: AstralObject[] = [];
    const center = Math.floor(size / 2);
    for (let i = 0; i < size; i++) {
      objects.push({ type: ObjectType.POLYANET, coordinates: { row: center, column: i } });
      objects.push({ type: ObjectType.POLYANET, coordinates: { row: i, column: center } });
    }
    return objects;
  }

  private static buildDiagonal(size: number): AstralObject[] {
    const objects: AstralObject[] = [];
    for (let i = 0; i < size; i++) {
      objects.push({ type: ObjectType.POLYANET, coordinates: { row: i, column: i } });
    }
    return objects;
  }

  private static buildCustom(size: number, pattern: (row: number, col: number) => ObjectType | null, config: ShapeConfig): AstralObject[] {
    const objects: AstralObject[] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const type = pattern(row, col);
        if (type === ObjectType.POLYANET) {
          objects.push({ type, coordinates: { row, column: col } });
        } else if (type === ObjectType.SOLOON && config.color) {
          objects.push({ type, coordinates: { row, column: col }, color: config.color } as Soloon);
        } else if (type === ObjectType.COMETH && config.direction) {
          objects.push({ type, coordinates: { row, column: col }, direction: config.direction } as Cometh);
        }
      }
    }
    return objects;
  }
} 