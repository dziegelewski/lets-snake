const { EventEmitter } = require('events');
const Rx = require('rxjs/Rx');
const sample = require('lodash/sample');
const without = require('lodash/without');

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const StartingPoint = require('./utils/StartingPoint');

class Arena extends EventEmitter {

  constructor() {
    super();

    this.width = 0;
    this.height = 0;

    this.startingPoints = [];
    this.obstacles = [];

    this.foodSpots = [];
    this.food = [];
    this.foodLeft = 10;

    this.snakes = {};

    this.snakesMovingInterval = null;
  }

  startSnakes() {
    this.stopSnakes();
    this.snakesMovingInterval = setInterval(() => {

      this.eachSnake((snake) => snake.move());
      this.eachSnake((snake) => this.checkSnakePosition(snake));

      this.stream({
        snakesFields: this.snakesFields,
        food: this.food
      })

    }, 150);
  }

  stopSnakes() {
    clearInterval(this.snakesMovingInterval);
  }

  toStream() {
    return Rx.Observable.fromEvent(this, 'stream');
  }

  stream(data) {
    this.emit('stream', data);
  }

  streamAll() {
    this.emit('stream', {
      width: this.width,
      height: this.height,
      obstacles: this.obstacles,
      food: this.food,
      snakesFields: this.snakesFields,
      snakesDetails: this.eachSnake((snake) => snake.provideDetails()),
    });
  }

  setSize(width, height = width) {
    this.width = width;
    this.height = height; 
  }

  registerSnake(snake) {
    this.snakes[snake.id] = snake;
    snake.born(
      this.startingPoints[0]
    );
    this.streamAll();

    if (!this.gameIsOn) {
      this.beginGame();
    }
  }

  checkSnakePosition(snake) {
    const whatsOnField = this.checkField(snake.head, snake);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood();
        this.removeFood(snake.head);
        if (this.foodLeft === 0) {
          this.levelCompleted();
        } else {
          this.distributeFood();
        }
        break;
      case 'obstacle':
      case 'snake':
        this.killSnake(snake);
      default:
    }

    return this;
  }

  killSnake(snake) {
    snake.die();
    delete this.snakes[snake.id];

    if (!this.hasAnySnakes) {
      this.gameIsOn = false;
      this.stopSnakes();
    }
  }

  removeFood(point) {
    this.food = this.food.filter((foodPoint) => {
      return !Arena.comparePoints(foodPoint, point);
    });
  }

  getSnakes() {
    return Object.values(this.snakes);
  }

  eachSnake(fn) {
    return this.getSnakes().map(fn);
  }

  get snakesFields() {
    return this.eachSnake((snake) => {
      return snake.fields || []
    }).flat() || []
  }

  get hasAnySnakes() {
    return this.getSnakes().length > 0; 
  }

  checkField(field, snake) {
    const checkIfIsOnField  = (comparedPoint) => Arena.comparePoints(comparedPoint, field);

    if (this.food.some(checkIfIsOnField)) {
      return 'food';
    }

    if (this.obstacles.some(checkIfIsOnField)) {
      return 'obstacle';
    }

    if ((snake
        ? (without(this.snakesFields, snake.head))
        : this.snakesFields
        ).some(checkIfIsOnField)
      ) {
      return 'snake';
    }

    return null;
  }


  distributeFood() {
    this.stream({ foodLeft: this.foodLeft });
    this.foodLeft--;
    this.food.push(
      sample(this.foodSpots)
    );
  }

  levelCompleted() {
    this.stopSnakes();
    this.emit('completed');

    if (this.levelsGenerator) {
      const { done, value } = this.levelsGenerator.next();
      
      if (done) {
        this.allLevelsCompleted();
      } else {
        this.useLevel(value);
      }

    }
  }

  allLevelsCompleted() {}


  static comparePoints(point1, point2) {
    return (point1.x === point2.x) && (point1.y === point2.y);
  }

  useLevelsGenerator(levelsGenerator) {
    this.levelsGenerator = levelsGenerator;
    this.useLevel(levelsGenerator.next().value);

    return this;
  }

  useLevel([levelMap, {
    food = 10,
  } = {}]) {

    const width = levelMap.reduce((longestRowLength, row) => Math.max(row.length, longestRowLength), 0);
    const height = levelMap.length;

    this.setSize(width, height);

    this.gameIsOn = false;

    this.startingPoints = pullFieldsMatrix(levelMap, 'R', 'L', 'U', 'D').map(StartingPoint.fromArray);
    this.obstacles = pullFields(levelMap, 'x');
    this.foodSpots = pullFields(levelMap, 'o');

    this.foodLeft = 10;

    this.distributeFood();

    if (this.hasAnySnakes) {
      this.rebornSnakes();
      this.beginGame();
    }

    this.streamAll();
    return this;
  }

  rebornSnakes() {
    this.eachSnake((snake, snakeIndex) => {
      snake.born(
        this.startingPoints[snakeIndex]
      );
    })
  }

  beginGame() {
    if (!this.gameIsOn) {

      this.gameIsOn = true;
      this.countdown()
        .then(() => this.startSnakes())
    }
  }

  async countdown() {
    for (let i = 3; i > 0; i--) {
      await this.shout(i, 1000);
    }
    await this.shout('Go Snakes', 1000);
    this.stream({ message: null });
    await wait(100);
  }

  async shout(message, time) {
    this.stream({ message });
    await wait(time);
  }
}

function pullFields(array3d, searchedSign) {

  return array3d.reduce((total, row, y) => {

    const totalFromRow = row.split('').reduce((total2, sign, x) => {
      if (sign === searchedSign) {
        total2.push({ x, y });
      }
      return total2;
    }, []);

    total.push(totalFromRow);
    return total;

  }, []).flat()
}

function pullFieldsMatrix(array3d, ...searchedSigns) {
  return searchedSigns.map((sign) => {
    return pullFields(array3d, sign).map((point) => [point, sign])
  }).flat();
}


module.exports = Arena;
