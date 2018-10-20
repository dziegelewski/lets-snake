class Snake {

  constructor() {
    this.id = idForSnake();
    this.food = 0;

    this.direction = 'right';
  }

  joinArena(arena) {
    this.arena = arena;
    arena.registerSnake(this)
    this.startMoving();

    return this;
  }


  startMoving() {
    this.moveInterval = setInterval(() => {
      this.move(this.direction);
    }, 150)
  }

  tail(fields) {
    this.fields = fields;

    this.renderOnArena();

    return this;
  }


  listenToKeyboard() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":

        this.turn(
          Snake.readDirection(e.key)
        );
      }
    })

    return this;
  }

  turn(newDirection) {
    const { lastDirection } = this;

    if (directionIsIn90degsToDirection(newDirection, lastDirection)) {
      this.direction = newDirection;
    }
  }


  move(direction) {

    if (!direction) return;

    const newFields = [...this.fields];
    const newHeadPosition = {...this.fields[0]}

    switch(direction) {
      case "up":
        newHeadPosition.y--;
        break;
      case "down":
        newHeadPosition.y++;
        break;
      case "left":
        newHeadPosition.x--;
        break;
      case "right":
        newHeadPosition.x++;
        break;
    }

    newFields.unshift(newHeadPosition);

    if (!this.food) {
      newFields.pop() 
    } else {
      this.food--;
    }

    this.fields = newFields;
    this.renderOnArena();

    this.lastDirection = direction;
  }

  renderOnArena() {
    this.arena.moveSnake(this)
  }

  obtainFood() {
    this.food++;
  }

  die() {
    clearInterval(this.moveInterval);
  }

  get head() {
    if (this.fields && this.fields.length) {
      return this.fields[0];
    } else {
      return {};
    }
  }



  static readDirection(arrowKey) {
    return arrowKey
      .replace('Arrow', '')
      .toLowerCase();
  }
}

function directionIsIn90degsToDirection(dir1, dir2) {
  switch(dir1) {
    case 'up':
    case 'down':
      return dir2 === 'left' || dir2 === 'right';
    case 'left':
    case 'right':
      return dir2 === 'up' || dir2 === 'down';
  }
}

const idForSnake = (() => {
  let id = 1;
  return () => id++;
})()

export default Snake;
