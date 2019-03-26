import { Point, Direction } from './types';

export class StartingPoint {
  field: Point;
  direction: Direction;

  constructor(field: Point, directionAbbrev: string) {
    this.field = field;
    this.direction = StartingPoint.directionMap(directionAbbrev);
  }

  static fromArray([ field, directionAbbrev]: [Point, string]) {
    return new StartingPoint(field, directionAbbrev)
  }

  static directionMap(directionAbbrev: string): Direction {
    switch(directionAbbrev) {
      case 'L':
      return 'left';
      case 'R':
      return 'right';
      case 'U':
      return 'up';
      case 'D':
      return 'down';
      default:
      throw Error('Incorrect direction');
    }
  }
}

