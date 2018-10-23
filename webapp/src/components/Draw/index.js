import React, { Component } from 'react';

const fieldSize = 15;

class Draw extends Component {

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    const { data } = this.props;

    this.clearCanvas(ctx);
    this.drawManyPoints(ctx, data.obstacles);
    this.drawManyPoints(ctx, data.food, 'pink');
    this.drawManyPoints(ctx, data.snakesFields, 'green');
  }

  drawManyPoints(ctx, points, color) {
    points.forEach((point) => {
      this.drawPoint(ctx, point, color);
    })
  }

  drawPoint(ctx, { x, y }, color) {
    if (color) {
      ctx.fillStyle = color;
    }

    ctx.fillRect(
      x * fieldSize,
      y * fieldSize,
      fieldSize,
      fieldSize
    );

    ctx.fillStyle = 'black';
  }

  clearCanvas(ctx) {
    ctx.clearRect(
      0, 0, this.props.data.width * fieldSize, this.props.data.height * fieldSize
    );
  }

  render() {
    const { data } = this.props;
    return (
      <canvas
        ref="canvas"
        width={data.width * fieldSize}
        height={data.height * fieldSize}
      />
    )


  }
}

export default Draw;
