const { EventEmitter } = require('events');
const Rx = require('rxjs/Rx');
const sample = require('lodash/sample');
const without = require('lodash/without');
const wait = require('delay');

const readLevelMap = require('./utils/readLevelMap');


class Arena extends EventEmitter {

  constructor() {
    super();

    this.width = 0;
    this.height = 0;

    this.startingPoints = [];
    this.obstacles = [];

    this.foodLeft = undefined;
    this.tempo = undefined;
    this.grow = undefined;


    this.foodSpots = [];
    this.food = [];

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

    }, this.tempo);
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

  streamEverything(extras) {
    this.emit('stream', {
      width: this.width,
      height: this.height,
      obstacles: this.obstacles,
      food: this.food,
      foodLeft: this.foodLeft,
      snakesFields: this.snakesFields,
      snakesDetails: this.eachSnake((snake) => snake.provideDetails()),
      ...extras,
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
    this.streamEverything();

    if (!this.gameIsOn) {
      this.beginGame();
    }
  }

  checkSnakePosition(snake) {
    const whatsOnField = this.checkField(snake.head, snake);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood();
        this.foodLeft--;
        this.stream({ foodLeft: this.foodLeft })
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

  killSnake(snake) {
    snake.die();
    delete this.snakes[snake.id];

    this.streamEverything();

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

  putFootOnTheBoard() {
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

  async allLevelsCompleted() {
    this.snakes = {};
    this.streamEverything({
      message: "That's it for today! Come back later!",
    });
  }

  static comparePoints(point1, point2) {
    return (point1.x === point2.x) && (point1.y === point2.y);
  }

  useLevelsGenerator(levelsGenerator) {
    this.levelsGenerator = levelsGenerator;
    this.useLevel(levelsGenerator.next().value);

    return this;
  }

  useLevel([levelMap, {
    tempo: levelTempo,
    food: levelFood,
    grow: levelGrow,
  } = {}]) {

    const readedMap = readLevelMap(levelMap)
    const [width, height] = readedMap.size;

    this.setSize(width, height);

    this.gameIsOn = false;

    this.startingPoints = readedMap.startingPoints;
    this.obstacles = readedMap.obstacles;
    this.foodSpots = readedMap.foodSpots;

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


module.exports = Arena;
