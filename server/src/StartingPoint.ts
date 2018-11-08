import { point, direction } from './types';

class StartingPoint {
  field: point;
  direction: direction;

  constructor(field: point, directionAbbrev: string) {
    this.field = field;
    this.direction = StartingPoint.directionMap(directionAbbrev);
  }

  static fromArray([ field, directionAbbrev]: [point, string]) {
    return new StartingPoint(field, directionAbbrev)
  }

  static directionMap(directionAbbrev: string): direction {
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

export default StartingPoint;