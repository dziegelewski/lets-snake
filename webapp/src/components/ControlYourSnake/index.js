import React from 'react';

export default ({ socket }) => {
  document.addEventListener('keydown', (e) => {
     switch(e.key) {
     case "ArrowUp":
     case "ArrowDown":
     case "ArrowLeft":
     case "ArrowRight":

      const direction = e.key.replace('Arrow', '').toLowerCase();
      socket.send(direction);
    }
  });

  return null;
};
