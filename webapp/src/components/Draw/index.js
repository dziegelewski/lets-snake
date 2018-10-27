import React, { useRef, useEffect } from 'react';

import {
  fieldSize,
  colors,
} from '../../consts';

const Draw = ({ data }) => {

  const canvasRef = useRef();
  useCanvas(canvasRef, data);

  return (
    <canvas
      ref={canvasRef}
      width={data.width * fieldSize}
      height={data.height * fieldSize}
    />
  )
}

function useCanvas(canvasRef, data) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      clearCanvas(ctx, data.width, data.height);
      drawManyPoints(ctx, data.obstacles);
      drawManyPoints(ctx, data.food, colors.food);
      drawManyPoints(ctx, data.snakesFields, colors.snake);
    }
  });
}

function drawManyPoints(ctx, points, color = colors.default) {
  ctx.fillStyle = color;
  points.forEach((point) => {
    drawPoint(ctx, point);
  });
}

function drawPoint(ctx, { x, y }) {
  ctx.fillRect(
    x * fieldSize,
    y * fieldSize,
    fieldSize,
    fieldSize,
  );
}

function clearCanvas(ctx, width, height) {
  ctx.clearRect(
    0, 0, width * fieldSize, height * fieldSize
  );
}

export default Draw;
