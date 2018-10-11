import Arena from './Arena';
import Snake from './Snake';
import { map } from './maps';

const arena = Arena.from('#app')
  .useMap(map)
  .draw();

window.arena = arena;


const goSnake = () => Snake.create()
  .joinArena(arena)
  .tail([
    {x: 10, y: 8},
    {x: 9, y: 8},
    {x: 8, y: 8},
    {x: 7, y: 8},
    {x: 6, y: 8},
    {x: 5, y: 8},
  ])
  .listenToKeyboard()


document.querySelector('#go').addEventListener('click', goSnake);
