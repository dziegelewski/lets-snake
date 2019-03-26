import { Snake } from './Snake';

export type Point = [number, number];

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface IStartingPoint {
  field: Point;
  direction: Direction;
}

export interface ISnakesCollection {
  [snakeId: number]: Snake;
}

export interface IReadMap {
    size: Point;
    obstacles: Point[];
    foodSpots: Point[];
    startingPoints: IStartingPoint[];
}

export interface IPointsMap {
  [letter: string]: Point[];
}

export type LevelMap = string[];

export interface ILevelConfig {
  food?: number;
  tempo?: number;
  grow?: number;
}

export type Level = [LevelMap, ILevelConfig?];

export interface IBroadcastedData {
  value: string;
}