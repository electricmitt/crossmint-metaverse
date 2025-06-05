// Coordinates for objects in the Megaverse
export interface Coordinates {
  row: number;
  column: number;
}

// Enum for object types
export enum ObjectType {
  POLYANET = 'POLYANET',
  SOLOON = 'SOLOON',
  COMETH = 'COMETH',
}

// Enum for Soloon colors
export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  WHITE = 'WHITE',
}

// Enum for Cometh directions
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// Base AstralObject type
export interface AstralObject {
  type: ObjectType;
  coordinates: Coordinates;
}

export interface Polyanet extends AstralObject {
  type: ObjectType.POLYANET;
}

export interface Soloon extends AstralObject {
  type: ObjectType.SOLOON;
  color: Color;
}

export interface Cometh extends AstralObject {
  type: ObjectType.COMETH;
  direction: Direction;
}

// MegaverseMap type (structure may be updated based on API response)
export interface MegaverseMap {
  map?: {
    content: any[][];
    [key: string]: any;
  };
  goal?: string[][];
}
