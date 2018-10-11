class Arena {

  static from(domSelector) {
    const root = document.querySelector(domSelector);
    const canvas = document.createElement('canvas');
    canvas.style.border = '2px solid black';
    root.appendChild(canvas);

    return new Arena(root, canvas);
  }

  constructor(root, canvas) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.fieldSize = 20;

    this.children = {
      obstacles: [],
      food: [],
      snakes: [],
    };
  }


  setFieldSize(size) {
    this.fieldSize = size;
  } 

  size(width, height = width) {

    const { fieldSize } = this;

    this.width = width;
    this.height = height; 

    this.canvas.width = width * fieldSize;
    this.canvas.height = height * fieldSize;

    return this;
  }

  obstacles(obstacles = []) {
    this.children.obstacles = obstacles;

    return this;
  }

  food(food = []) {
    this.children.food = food;

    return this;
  }

  registerSnake(snake) {
    this.children.snakes = [snake];
  }

  moveSnake(snake) {
    this.draw();
    this.drawManyPoints(snake.fields);

    const whatsOnField = this.checkField(snake.head);

    switch(whatsOnField) {
      case 'food':
        snake.obtainFood();
        this.removeFood(snake.head);
        break;
      case 'obstacle':
        snake.die();
        this.snakes = [];
      default:
    }

    return this;
  }

  removeSnake() {
    this.draw();

    return this;
  }

  removeFood(point) {
    this.children.food = this.children.food.filter((foodPoint) => {
      return !Arena.comparePoints(foodPoint, point);
    });
  }


  draw() {
    this.clearCanvas();

    this.drawManyPoints(this.children.obstacles);
    this.drawManyPoints(this.children.food, 'pink');

    return this;
  }

  drawManyPoints(points, color) {
    points.forEach((point) => {
      this.drawPoint(point, color);
    })
  }

  drawPoint({ x, y }, color) {
    const { ctx } = this;

    if (color) {
      ctx.fillStyle = color;
    }

    const { fieldSize } = this;
    ctx.fillRect(
      x * fieldSize,
      y * fieldSize,
      fieldSize,
      fieldSize
    );

    ctx.fillStyle = 'black';
  }

  checkField(field) {
    const checkIfIsOnField  = (comparedPoint) => Arena.comparePoints(comparedPoint, field);

    if (this.children.food.some(checkIfIsOnField)) {
      return 'food';
    }

    if (this.children.obstacles.some(checkIfIsOnField)) {
      return 'obstacle';
    }

    return null;
  }

  checkFieldForFood(point) {
  }

  clearCanvas() {
    const { ctx } = this;
    ctx.clearRect(
      0, 0, this.canvas.width, this.canvas.height
    );
  }

  fieldToPx(value) {
    return value * this.fieldSize;
  }

  static comparePoints(point1, point2) {
    return (point1.x === point2.x) && (point1.y === point2.y);
  }

  useMap(map) {

    const width = map.length;
    const height = map[0].length;

    this
      .size(width, height)
      .obstacles(
        pullFields(map, 'x')
      )
      .food(
        pullFields(map, 'o')
      )

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

export default Arena;
