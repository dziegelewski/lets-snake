class Canvas {

  constructor(width, height = width) {
    const canvas = document.createElement('canvas');
    canvas.style.border = '2px solid black';
    this.cnv = canvas;
    this.ctx = this.cnv.getContext("2d");
    this.fieldSize = 20;

    if (width && height) {
      this.setSize(width, height);
    }
  }


  setSize(width, height = width) {

    const { fieldSize } = this;

    this.cnv.width = width * fieldSize;
    this.cnv.height = height * fieldSize;

    return this;
  }

  draw(obstacles, food, snakes) {
    this.clearCanvas();

    this.drawManyPoints(obstacles);
    this.drawManyPoints(food, 'pink');
    this.drawManyPoints(snakes, 'green');

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

  clearCanvas() {
    const { ctx } = this;
    ctx.clearRect(
      0, 0, this.cnv.width, this.cnv.height
    );
  }


}

export default Canvas;
