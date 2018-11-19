interface Props {
  socket: WebSocket;
}

export default ({ socket }: Props): any => {
  document.addEventListener('keydown', ({ key }) => {
    switch(key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        sendDirection(key);
    }
  });

  const sendDirection = (key: string): void => {
    const direction = key
      .replace('Arrow', '')
      .toLowerCase();
      
    socket.send(direction);
  };

  return null;
};
