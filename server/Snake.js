const sample = require('lodash/sample');
const reduce = require('lodash/reduce');
let snakeIds = 0;

class Snake {

  constructor(length = 0) {
    this.id = ++snakeIds;
    this.food = 0;
    this.fields = new Array(length);
    this.name = Snake.randomName();

    this.direction = 'right';
  }

  joinArena(arena) {
    this.arena = arena;
    arena.registerSnake(this);

    return this;
  }

  born(startingPoint) {
    this.fields = [startingPoint.field];
    this.direction = startingPoint.direction;
    this.food = 2;

    return this;
  }

  turn(newDirection) {
    const { lastDirection } = this;

    if (Snake.directionIsIn90degsToDirection(newDirection, lastDirection)) {
      this.direction = newDirection;
    }
  }

  move() {
    const { direction } = this;

    if (!direction) return;

    const newFields = [...this.fields];
    const newHeadPosition = Array.from(this.fields[0]);

    switch(direction) {
      case "left":
        newHeadPosition[0]--;
        break;
      case "right":
        newHeadPosition[0]++;
        break;
      case "up":
        newHeadPosition[1]--;
        break;
      case "down":
        newHeadPosition[1]++;
        break;
    }

    newFields.unshift(newHeadPosition);

    if (!this.food) {
      newFields.pop() 
    } else {
      this.food--;
    }

    this.fields = newFields;
    this.lastDirection = direction;
  }

  obtainFood(growingSpeed) {
    this.food += growingSpeed;
  }

  provideDetails() {
    return {
      name: this.name,
      id: this.id,
    }
  }

  die() {}

  get head() {
    if (this.fields && this.fields.length) {
      return this.fields[0];
    } else {
      return {};
    }
  }

  get length() {
    return this.fields.length + this.food;
  }

  static readDirection(arrowKey) {
    return arrowKey
      .replace('Arrow', '')
      .toLowerCase();
  }

  static directionIsIn90degsToDirection(dir1, dir2) {
    switch(dir1) {
      case 'up':
      case 'down':
        return dir2 === 'left' || dir2 === 'right';
      case 'left':
      case 'right':
        return dir2 === 'up' || dir2 === 'down';
    }
  }

  static randomName() {
    return sample(['Sth', 'Frv', 'Neu', 'Sgv']) + sample(['lugh', 'suss', 'evgh', 'vrssu']);
  }

  static findLongest(snakesObj) {

    return reduce(
      snakesObj,
      (acc, snake) => {
        if (acc.length === 0) {
          return [snake];
        }
        if (snake.length > acc[0].length) {

          return [snake];
        }

        if (snake.length === acc[0].length) {

          return [...acc, snake];
        }
        return acc;
      },
      []
    );
  }
}

module.exports = Snake;
