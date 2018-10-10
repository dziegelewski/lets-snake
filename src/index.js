import Arena from './Arena';
import Snake from './Snake';

const arena = Arena.from('#app')
  .size(30, 30)
  .obstacless([
      {x: 0, y: 0},
      {x: 3, y: 3},
   ])
  .foodd([
      {x: 14, y: 14},
      {x: 14, y: 15},
      {x: 14, y: 16},
      {x: 14, y: 17},
      {x: 14, y: 18},
      {x: 14, y: 19},

    ])
  .draw();


window.arena = arena;

const snake = Snake.join(arena)
  .tail([
    {x: 10, y: 8},
    {x: 9, y: 8},
    {x: 8, y: 8},
    {x: 7, y: 8},
    {x: 6, y: 8},
    {x: 5, y: 8},
  ])
  .listenToKeyboard()


window.sn = snake;
