import Arena from './Arena';
import Snake from './Snake';
import { map } from './maps';

const arena = new Arena()
  .useMap(map)
  .mount('#app')

window.arena = arena;


const goSnake = () => new Snake()
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
