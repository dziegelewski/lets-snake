const { EventEmitter } = require('events');
const Rx = require('rxjs/Rx');

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const StartingPoint = require('./utils/StartingPoint');

class Arena extends EventEmitter {

  constructor() {
    super();

    this.width = 0;
    this.height = 0;

    this.startingPoints = [];
    this.obstacles = [];
    this.food = [];
    this.snakes = {};

    this.message = null;
  }

  stream() {
    return Rx.Observable.fromEvent(this, 'stream');
  }

  setSize(width, height = width) {
    this.width = width;
    this.height = height; 
  }

  redraw() {
    this.emit('stream', this.extractedFields());
  }

  extractedFields() {
    return {
      width: this.width,
      height: this.height,
      obstacles: this.obstacles,
      food: this.food,
      snakesFields: this.snakesFields,
      snakesNames: this.eachSnake(snake => snake.name),
      message: this.message,
    }
  }

  registerSnake(snake) {
    this.snakes[snake.id] = snake;
    snake.born(
      this.startingPoints[0]
    );
    this.redraw();

    if (this.gameIsOn) {
      snake.startMoving();
    } else {
      this.beginGame();
    }
  }

  goSnakes() {
    this.eachSnake(snake => snake.startMoving());
  }

  moveSnake(snake) {
    const whatsOnField = this.checkField(snake.head);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood();
        this.removeFood(snake.head);
        if (this.food.length === 0) this.levelCompleted();
        break;
      case 'obstacle':
        this.killSnake(snake);
      default:
    }

    this.redraw();
    return this;
  }

  killSnake(snake) {
    snake.die();
    delete this.snakes[snake.id];

    if (!this.hasAnySnakes) {
      this.gameIsOn = false;
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

  checkField(field) {
    const checkIfIsOnField  = (comparedPoint) => Arena.comparePoints(comparedPoint, field);

    if (this.food.some(checkIfIsOnField)) {
      return 'food';
    }

    if (this.obstacles.some(checkIfIsOnField)) {
      return 'obstacle';
    }

    return null;
  }

  levelCompleted() {
    this.eachSnake((snake) => snake.stopMoving());
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

  useLevel(levelMap) {

    const width = levelMap.reduce((longestRowLength, row) => Math.max(row.length, longestRowLength), 0);
    const height = levelMap.length;

    this.setSize(width, height);

    this.gameIsOn = false;

    this.startingPoints = pullFieldsMatrix(levelMap, 'R', 'L', 'U', 'D').map(StartingPoint.fromArray);
    this.obstacles = pullFields(levelMap, 'x');
    this.food = pullFields(levelMap, 'o');

    if (this.hasAnySnakes) {
      this.rebornSnakes();
      this.beginGame();
    }

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
        .then(() => this.goSnakes())
    }
  }

  async countdown() {
    for (let i = 3; i > 0; i--) {
      await this.shout(i, 1000);
    }
    await this.shout('Go Snakes', 1000);
    this.message = null;
    await wait(100);
  }

  async shout(message, time) {
    this.message = message;
    this.redraw();
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
