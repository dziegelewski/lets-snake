import React, { useRef, useEffect } from 'react';

import {
  fieldSize,
  colors,
} from 'consts';

import './style.css';

const Draw = ({ data, children }) => {

  const canvasRef = useRef();
  useCanvas(canvasRef, data);

  const width = data.size[0] * fieldSize;
  const height = data.size[1] * fieldSize;

  return (
    <div
      className="draw-wrapper"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
      {children}
    </div>
  );
}

function useCanvas(canvasRef, data) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      clearCanvas(ctx, data.size);
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

function drawPoint(ctx, [x, y]) {
  ctx.fillRect(
    x * fieldSize,
    y * fieldSize,
    fieldSize,
    fieldSize,
  );
}

function clearCanvas(ctx, [width, height]) {
  ctx.clearRect(
    0, 0, width * fieldSize, height * fieldSize
  );
}

export default Draw;
