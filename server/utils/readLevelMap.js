const compact = require('lodash/compact');
const StartingPoint = require('./StartingPoint');

function readLevelMap(levelMap) {

  const size = readSize(levelMap);
  const points = readPoints(levelMap);

  const obstacles = points['x'];
  const foodSpots = points['o'];
  const startingPoints = startingPointsFromPoints(points);

  return {
    size,
    obstacles,
    foodSpots,
    startingPoints,
  }
}

function readSize(levelMap) {
 const width = levelMap.reduce(
    (longestRowLength, row) => Math.max(row.length, longestRowLength),
    0
  );
  const height = levelMap.length;

  return [width, height];
}

function readPoints(levelMap) {

  const pointsTypes = {};

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

function startingPointsFromPoints(points) {

  return ['R', 'L', 'U', 'D'].map((direction) => {

    if (points.hasOwnProperty(direction)) {
      return points[direction].map((xyOfDirection) => {
        return [xyOfDirection, direction];
      });
    }
    else {
      return []
    }
  })
    .flat()
    .map(StartingPoint.fromArray)
}

module.exports = readLevelMap;