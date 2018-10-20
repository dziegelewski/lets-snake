const { EventEmitter } = require('events');
const Rx = require('rxjs/Rx');

class Arena extends EventEmitter {

  constructor() {
    super();

    this.width = 0;
    this.height = 0;

    this.obstacles = [];
    this.food = [];
    this.snakes = {};
  }

  toStream() {
    return Rx.Observable.fromEvent(this, 'redraw');
  }

  setSize(width, height = width) {
    this.width = width;
    this.height = height; 
  }

  redraw() {
    this.emit('redraw', this.extractedFields());
  }

  extractedFields() {
    return {
      width: this.width,
      height: this.height,
      obstacles: this.obstacles,
      food: this.food,
      snakesFields: this.snakesFields,
    }
  }

  registerSnake(snake) {
    this.snakes[snake.id] = snake;
    this.redraw();
  }

  moveSnake(snake) {
    const whatsOnField = this.checkField(snake.head);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood();
        this.removeFood(snake.head);
        break;
      case 'obstacle':
        snake.die();
        delete this.snakes[snake.id];
      default:
    }

    this.redraw();
    return this;
  }

  removeFood(point) {
    this.food = this.food.filter((foodPoint) => {
      return !Arena.comparePoints(foodPoint, point);
    });
  }

  eachSnake() {
    return Object.values(this.snakes);
  }

  get snakesFields() {
    return this.eachSnake().map((snake) => {
      return snake.fields || []
    }).flat()
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


  static comparePoints(point1, point2) {
    return (point1.x === point2.x) && (point1.y === point2.y);
  }

  useMap(map) {

    const width = map.length;
    const height = map[0].length;

    this.setSize(width, height);
    
    this
      .placeObstacles(
        pullFields(map, 'x')
      )
      .placeFood(
        pullFields(map, 'o')
      );

    return this;
  }


  placeObstacles(obstacles = []) {
    this.obstacles = obstacles;

    return this;
  }

  placeFood(food = []) {
    this.food = food;

    return this;
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


module.exports = Arena;
