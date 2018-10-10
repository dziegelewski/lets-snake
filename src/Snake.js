class Snake {

  static join(arena) {
    return new Snake(arena);
  }

  constructor(arena) {
    this.arena = arena;
    this.food = 0;

    this.moveInterval = setInterval(() => {
      this.move(this.direction);
    }, 200)
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

  turn(direction) {
    this.direction = direction;
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
  }

  renderOnArena() {
    this.arena.moveSnake(this)
  }

  removeFromArena() {
    this.arena.removeSnake();
  }

  obtainFood() {
    this.food++;
  }

  die() {
    clearInterval(this.moveInterval);
    this.removeFromArena();
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

export default Snake;
