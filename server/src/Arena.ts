import Timeout = NodeJS.Timeout;
import { point, ISnakesCollection, level } from './types';

import * as Rx from 'rxjs/Rx';
import { Snake } from './Snake';
import { EventEmitter } from 'events';
import { sample, without } from 'lodash';
import wait from 'delay';

import { StartingPoint } from './StartingPoint';
import { readLevelMap } from './readLevelMap';
const findLongestSnake = Snake.findLongest;

export class Arena extends EventEmitter {
  foodLeft: number;
  tempo: number;
  grow: number;
  snakesMovingInterval: Timeout;

  size: point = [0, 0];
  obstacles: point[];
  foodSpots: point[];
  food: point[] = [];

  snakes: ISnakesCollection = {};
  startingPoints: StartingPoint[] = [];

  gameIsOn: boolean;
  levelsGenerator: Generator;
  [index: string]: any;

  startSnakes(): void {
    this.stopSnakes();
    this.snakesMovingInterval = setInterval(() => {

      this.eachSnake((snake) => snake.move());
      this.eachSnake((snake) => this.checkSnakePosition(snake));

      this.stream('snakesFields', 'food');

    }, this.tempo);
  }

  stopSnakes(): void {
    clearInterval(this.snakesMovingInterval);
  }

  toStream(): Rx.Observable<{}> {
    return Rx.Observable.fromEvent(this, 'stream');
  }

  stream(...data: (string | object)[]): void {

    const dataToStream: object = data.reduce((acc: any, value) => {

      let parsedValue;
      if (typeof value === 'string') {
        parsedValue = { [value]: this[value] };
      } else {
        parsedValue = value;
      }

      return { ...acc, ...parsedValue };
    }, {});

    this.emit('stream', dataToStream);
  }

  streamEverything(): void {
    this.stream(
      'size',
      'obstacles',
      'food',
      'foodLeft',
      'snakesFields',
      'snakesDetails',
    );
  }

  registerSnake(snake: Snake): void {
    this.snakes[snake.id] = snake;
    snake.born(
      this.startingPoints[0]
    );
    this.streamEverything();

    if (!this.gameIsOn) {
      this.beginGame();
    }
  }

  checkSnakePosition(snake: Snake): this {
    const whatsOnField = this.checkField(snake.head, snake);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood(this.grow);
        this.foodLeft--;
        this.stream('foodLeft', 'snakesDetails');
        this.removeFood(snake.head);
        if (this.foodLeft === 0) {
          this.levelCompleted();
        } else {
          this.putFootOnTheBoard();
        }
        break;
      case 'obstacle':
      case 'snake':
        this.killSnake(snake);
      default:
    }

    return this;
  }

  killSnake(snake: Snake): void {
    snake.die();
    delete this.snakes[snake.id];

    this.streamEverything();

    if (!this.hasAnySnakes) {
      this.gameIsOn = false;
      this.stopSnakes();
    }
  }

  removeFood(point: point): void {
    this.food = this.food.filter((foodPoint) => {
      return !Arena.comparePoints(foodPoint, point);
    });
  }

  getSnakes(): Snake[] {
    return Object.values(this.snakes);
  }

  eachSnake(fn: (snake: Snake, snakeIndex: number) => any): any[] {
    return this.getSnakes().map(fn);
  }

  get hasAnySnakes(): boolean {
    return this.getSnakes().length > 0; 
  }

  get snakesFields(): point[] {
    return this.eachSnake((snake) => {
      return snake.fields || []
    }).flat() || [];
  }

  get snakesDetails(): Object {
    return this.eachSnake((snake) => snake.provideDetails());
  }

  checkField(field: point, snake: Snake): string {
    const isOnField = (comparedPoint: point): boolean => Arena.comparePoints(comparedPoint, field);

    if (this.food.some(isOnField)) {
      return 'food';
    }

    if (this.obstacles.some(isOnField)) {
      return 'obstacle';
    }

    if ((snake
        ? (without(this.snakesFields, snake.head))
        : this.snakesFields
        ).some(isOnField)
      ) {
      return 'snake';
    }

    return null;
  }

  putFootOnTheBoard(): void {
    this.food.push(
      sample(this.foodSpots)
    );
  }

  async levelCompleted(): Promise<void> {
    this.stopSnakes();
    this.emit('completed');

    await this.anounceAndRewardWinner();

    this.nextLevel();
  }

  async anounceAndRewardWinner(): Promise<void> {
    const winners = findLongestSnake(this.snakes);

    winners.forEach(snake => snake.obtainTrophy());
    this.stream('snakesDetails');
    await this.shout(
      this.generateWinnerMessage(winners),
      2500,
    )
    this.stream({ message: null });
  }

  generateWinnerMessage(snakesWinners: Snake[]): string {
    return snakesWinners.map(snake => snake.name).join(' and ') + ' wins';
  }

  nextLevel(): void {
    if (this.levelsGenerator) {
      const { done, value } = this.levelsGenerator.next();

      if (done) {
        this.allLevelsCompleted();
      } else {
        this.useLevel(value);
      }
    }
  }

  async allLevelsCompleted(): Promise<void> {
    this.snakes = {};
    this.streamEverything();
    this.stream({
      message: "That's it for today! Come back later!",
    })
  }

  static comparePoints(point1: point, point2: point): boolean {
    return point1.toString() === point2.toString();
  }

  useLevelsGenerator(levelsGenerator: Generator): this {
    this.levelsGenerator = levelsGenerator;
    this.useLevel(levelsGenerator.next().value);

    return this;
  }

  useLevel([
    levelMap,
      {
        tempo: levelTempo = 150,
        food: levelFood = 15,
        grow: levelGrow = 1,
      } = {}
    ]: level): this {

    this.gameIsOn = false;

    const mapData = readLevelMap(levelMap);

    this.size = mapData.size;
    this.startingPoints = mapData.startingPoints;
    this.obstacles = mapData.obstacles;
    this.foodSpots = mapData.foodSpots;

    this.tempo = levelTempo;
    this.foodLeft = levelFood;
    this.grow = levelGrow;
    
    this.putFootOnTheBoard();

    if (this.hasAnySnakes) {
      this.rebornSnakes();
      this.beginGame();
    }

    this.streamEverything();

    return this;
  }

  rebornSnakes(): void {
    this.eachSnake((snake, snakeIndex) => {
      snake.born(
        this.startingPoints[snakeIndex]
      );
    })
  }

  async beginGame(): Promise<void> {
    if (!this.gameIsOn) {
      this.gameIsOn = true;
      this.countdown()
        .then(() => this.startSnakes())
    }
  }

  async countdown(): Promise<void> {
    for (let i = 3; i > 0; i--) {
      await this.shout(i.toString(), 1000);
    }
    await this.shout('Go Snakes', 1000);
    this.stream({ message: null });
    await wait(100);
  }

  async shout(message: string, time: number): Promise<void> {
    this.stream({ message });
    await wait(time);
  }
}
