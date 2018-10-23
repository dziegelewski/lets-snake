const sample = require('lodash/sample')
let snakeIds = 0;

class Snake {

  constructor() {
    this.id = ++snakeIds;
    this.food = 0;
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
    const newHeadPosition = {...this.fields[0]};

    switch(direction) {
      case "up":
        newHeadPosition.y--;
        break;
      case "down":
        newHeadPosition.y++;
        break;
      case "left":
        newHeadPosition.x--;
        break;
      case "right":
        newHeadPosition.x++;
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

  obtainFood() {
    this.food+= 4;
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
}

module.exports = Snake;
