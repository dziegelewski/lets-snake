const { EventEmitter } = require('events');
const Rx = require('rxjs/Rx');
const sample = require('lodash/sample');
const without = require('lodash/without');
const wait = require('delay');

const findLongestSnake = require('./Snake').findLongest;
const readLevelMap = require('./utils/readLevelMap');

class Arena extends EventEmitter {

  constructor() {
    super();

    this.size = [0, 0];

    this.foodLeft = undefined;
    this.tempo = undefined;
    this.grow = undefined;

    this.obstacles = [];
    this.foodSpots = [];
    this.food = [];
    this.snakes = {};
    this.startingPoints = [];

    this.snakesMovingInterval = null;
  }

  startSnakes() {
    this.stopSnakes();
    this.snakesMovingInterval = setInterval(() => {

      this.eachSnake((snake) => snake.move());
      this.eachSnake((snake) => this.checkSnakePosition(snake));

      this.stream('snakesFields', 'food');

    }, this.tempo);
  }

  stopSnakes() {
    clearInterval(this.snakesMovingInterval);
  }

  toStream() {
    return Rx.Observable.fromEvent(this, 'stream');
  }

  stream(...data) {

    const dataToStream = data.reduce((acc, value) => {

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

  streamEverything() {
    this.stream(
      'size',
      'obstacles',
      'food',
      'foodLeft',
      'snakesFields',
      'snakesDetails',
    );
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


  get hasAnySnakes() {
    return this.getSnakes().length > 0; 
  }

  get snakesFields() {
    return this.eachSnake((snake) => {
      return snake.fields || []
    }).flat() || [];
  }

  get snakesDetails() {
    return this.eachSnake((snake) => snake.provideDetails());
  }

  checkField(field, snake) {
    const isOnField = (comparedPoint) => Arena.comparePoints(comparedPoint, field);

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

  putFootOnTheBoard() {
    this.food.push(
      sample(this.foodSpots)
    );
  }

  async levelCompleted() {
    this.stopSnakes();
    this.emit('completed');

    await this.anounceAndRewardWinner();


    this.nextLevel();
  }

  async anounceAndRewardWinner() {
    const winners = findLongestSnake(this.snakes);

    winners.forEach(snake => snake.obtainTrophy());
    this.stream('snakesDetails');
    await this.shout(
      this.generateWinnerMessage(winners),
      2500,
    )
    this.stream({ message: null });
  }

  generateWinnerMessage(snakesWinners) {
    return snakesWinners.map(snake => snake.name).join(' and ') + ' wins';
  }

  nextLevel() {
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
    this.streamEverything();
    this.stream({
      message: "That's it for today! Come back later!",
    })
  }

  static comparePoints(point1, point2) {
    return point1.toString() === point2.toString();
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

    this.gameIsOn = false;

    const readedMap = readLevelMap(levelMap)

    this.size = readedMap.size;
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

  async beginGame() {
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
