import { point, LevelMap, IReadMap, IPointsMap } from "./types";
import { StartingPoint } from './StartingPoint';

export function readLevelMap(levelMap: LevelMap): IReadMap {
  const size = readSize(levelMap);
  const points = readPoints(levelMap);

  const obstacles: point[] = points['x'];
  const foodSpots: point[] = points['o'];
  const startingPoints = startingPointsFromPoints(points);

  return {
    size,
    obstacles,
    foodSpots,
    startingPoints,
  }
}

function readSize(levelMap: LevelMap): point {
 const width = levelMap.reduce(
    (longestRowLength: number, row: string): number => Math.max(row.length, longestRowLength),
    0
  );
  const height = levelMap.length;

  return [width, height];
}

function readPoints(levelMap: LevelMap): IPointsMap {

  const pointsTypes: IPointsMap = {};

  levelMap.forEach((row, y) => {

    row.split('').forEach((cellValue, x) => {

      if (cellValue !== ' ') {
        if (!pointsTypes.hasOwnProperty(cellValue)) {
          pointsTypes[cellValue] = [];
        }
        pointsTypes[cellValue].push([x, y])
      }

    })
  });

  return pointsTypes;
}

function startingPointsFromPoints(points: IPointsMap): StartingPoint[] {

  return ['R', 'L', 'U', 'D'].flatMap((direction) => {

    if (points.hasOwnProperty(direction)) {
      return points[direction].map((xyOfDirection) => {
        return [xyOfDirection, direction];
      });
    }
    else {
      return []
    }
  })
    .map(StartingPoint.fromArray)
}