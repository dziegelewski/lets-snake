import { point, direction, ISnakesCollection } from './types';
import { Arena } from './Arena';
import { StartingPoint } from './StartingPoint';

import { sample, reduce } from 'lodash';

const foodOnBorn = 2;
let snakeIds = 0;

export class Snake {
  id: number;
  food: number = 0;
  trophies: number = 0;
  fields: point[]; 
  name: string;
  direction: direction;
  lastDirection: direction;
  arena: Arena;
  [value: string]: any;

  constructor(length: number = 0) {
    this.id = ++snakeIds;
    this.fields = new Array(length);
    this.name = Snake.randomName();
    this.direction = 'right';
  }

  joinArena(arena: Arena): this {
    this.arena = arena;
    arena.registerSnake(this);

    return this;
  }

  born(startingPoint: StartingPoint): this {
    this.fields = [startingPoint.field];
    this.direction = startingPoint.direction;
    this.food = foodOnBorn;

    return this;
  }

  turn(newDirection: direction): void {
    const { lastDirection } = this;

    if (Snake.directionIsIn90degsToDirection(newDirection, lastDirection)) {
      this.direction = newDirection;
    }
  }

  move(): void {
    const { direction } = this;

    if (!direction) return;

    const newHeadPosition = (this.fields[0].slice() as point);

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

    const newFields = [
      newHeadPosition,
      ...this.fields,
    ]


    if (!this.food) {
      newFields.pop() 
    } else {
      this.food--;
    }

    this.fields = newFields;
    this.lastDirection = direction;
  }

  obtainFood(growingSpeed: number): void {
    this.food += growingSpeed;
  }

  obtainTrophy(): void {
    this.trophies++;
  }

  provideDetails(): object {
    return {
      name: this.name,
      id: this.id,
      trophies: this.trophies,
      scores: this.length - foodOnBorn - 1,
    };
  }

  die(): void {}

  get head(): point {
    if (this.fields && this.fields.length) {
      return this.fields[0];
    } else {
      return null;
    }
  }

  get length(): number {
    return this.fields.length + this.food;
  }

  static readDirection(arrowKey: string): direction {
    return <direction>arrowKey
      .replace('Arrow', '')
      .toLowerCase();
  }

  static directionIsIn90degsToDirection(dir1: direction, dir2: direction): boolean {
    switch(dir1) {
      case 'up':
      case 'down':
        return dir2 === 'left' || dir2 === 'right';
      case 'left':
      case 'right':
        return dir2 === 'up' || dir2 === 'down';
    }
  }

  static randomName(): string {
    return sample(['Sth', 'Frv', 'Neu', 'Sgv']) + sample(['lugh', 'suss', 'evgh', 'vrssu']);
  }

  static findOnesWithBiggestValue(value = 'length', snakesObj: ISnakesCollection): Snake[] {

    return reduce(
      snakesObj,
      (acc, snake) => {
        if (acc.length === 0) {
          return [snake];
        }
        if (snake[value] > acc[0][value]) {

          return [snake];
        }

        if (snake[value] === acc[0][value]) {

          return [...acc, snake];
        }
        return acc;
      },
      []
    );
  }

  static findLongest(snakesObj: ISnakesCollection): Snake[] {
    return Snake.findOnesWithBiggestValue('length', snakesObj);
  }
}