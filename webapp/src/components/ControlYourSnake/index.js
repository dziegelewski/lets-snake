export default ({ socket }) => {
  document.addEventListener('keydown', ({ key }) => {
    switch(key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        sendDirection(key);
    }
  });

  const sendDirection = (key) => {
    const direction = key
      .replace('Arrow', '')
      .toLowerCase();
      
    socket.send(direction);
  };

  return null;
};
