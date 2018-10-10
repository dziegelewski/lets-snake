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
    this.obstacles = [];
    this.food = [];
    this.fieldSize = 20;
  }

  setFieldSize(size) {
    this.fieldSize = size;
  } 

  size(width, height = width) {

    this.width = width;
    this.height = height; 

    this.canvas.width = this.fieldToPx(width);
    this.canvas.height = this.fieldToPx(height);

    return this;
  }

  obstacless(obst = []) {
    this.obstacles = obst;

    return this;
  }

  foodd(food = []) {
    this.food = food;

    return this;
  }

  drawInterval(interval) {
    this.interval = setInterval(() => this.draw, interval);
  }

  stopDrawInterval() {
    clearInterval(this.interval);
  }


  moveSnake(snake) {
    this.draw();
    this.drawManyPoints(snake.fields);


    if (this.checkFieldForFood(snake.head)) {
      snake.obtainFood();
      this.removeFood(snake.head);
    }


    return this;
  }

  removeSnake() {
    this.draw();

    return this;
  }

  removeFood(point) {
    this.food = this.food.filter((foodPoint) => {
      return !Arena.comparePoints(foodPoint, point);
    });
  }


  draw() {
    this.clearCanvas();
    this.drawManyPoints(this.obstacles);
    this.drawManyPoints(this.food, 'pink');

    return this;
  }

  drawManyPoints(points, color) {
    points.forEach((point) => {
      this.drawPoint(point, color);
    })
  }

  drawPoint({ x, y }, color) {
    const ctx = this.canvas.getContext("2d");

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

  checkFieldForFood(point) {
    return this.food.some((foodPoint) => Arena.comparePoints(foodPoint, point));
  }

  clearCanvas() {
    const ctx = this.canvas.getContext("2d");
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



}

export default Arena;
