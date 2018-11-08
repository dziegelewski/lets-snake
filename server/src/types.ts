import Snake from './Snake';

export type point = [number, number];

export type direction = 'left' | 'right' | 'up' | 'down';

export interface IStartingPoint {
  field: point;
  direction: direction;
}

export interface ISnakesCollection {
  [snakeId: number]: Snake;
}

export interface IReadMap {
    size: point;
    obstacles: point[];
    foodSpots: point[];
    startingPoints: IStartingPoint[];
}

export interface IPointsMap {
  [letter: string]: point[];
}

export type LevelMap = string[];

export interface ILevelConfig {
  food?: number;
  tempo?: number;
  grow?: number;
}

export type level = [LevelMap, ILevelConfig?];