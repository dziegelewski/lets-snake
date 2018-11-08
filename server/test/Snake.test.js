 const { Snake } = require('../dist/Snake');
 
 describe('Snake', () => {
   describe('static findLongest', () => {
 
     const snakeLen1 = new Snake(1);
     const snakeLen2 = new Snake(2);
     const snakeLen3 = new Snake(3);
     const snakeLen4 = new Snake(4);
     const snakeLen5 = new Snake(5);
 
     it('returns empty array if there are no snakes', () => {
       expect(Snake.findLongest(
         {}
       )).to.be.deep.equal([])
     });
 
     it('returns this snake if there is only one', () => {
       expect(Snake.findLongest(
         { snakeLen1 }
       ))
       .to.be.ofSize(1).and
       .to.be.containingAllOf([ snakeLen1 ]);
     });
  
      it('returns two snakes, if there are one shorter and two with equal length', () => {
       const anotherSnakeLen2 = new Snake(2);
         expect(Snake.findLongest(
          { snakeLen1, snakeLen2, anotherSnakeLen2 }
        ))
       .to.be.ofSize(2).and
       .to.be.containingAllOf([ snakeLen2, anotherSnakeLen2 ]);
      });
   
     it('returns longest snake from group of 5 snakes', () => {
       expect(Snake.findLongest(
          { snakeLen1, snakeLen2, snakeLen3, snakeLen3, snakeLen4, snakeLen5 }
        ))
       .to.be.ofSize(1).and
       .to.be.containingAllOf([ snakeLen5 ]);
     })
   });
 
   describe('move', () => {
 
     it('moves right if its direction is right', () => {
      const snake = new Snake();
      snake.food = 0;
      snake.direction = 'right';

      snake.fields = [
        [2, 0],
        [1, 0],
        [0, 0],
      ];

      snake.move();

      expect(snake.fields)
        .to.be.deep.equal([
          [3, 0],
          [2, 0],
          [1, 0],
        ]);
     });
 
     it('doesnt move if it has no direction', () => {
      const snake = new Snake();
      snake.food = 0;
      snake.direction = undefined;

      snake.fields = [
        [2, 0],
        [1, 0],
        [0, 0],
      ];

      snake.move();

      expect(snake.fields)
        .to.be.deep.equal([
          [2, 0],
          [1, 0],
          [0, 0],
        ]);
 
     })
 
   });
 });