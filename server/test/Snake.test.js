const Snake = require('../Snake');

describe('Snake', () => {
  describe('static findLongest', () => {

    const snakeLen1 = new Snake(1);
    const snakeLen2 = new Snake(2);
    const snakeLen2Bis = new Snake(2);
    const snakeLen3 = new Snake(3);
    const snakeLen4 = new Snake(4);


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
      .to.be.containingAllOf([ snakeLen1 ])
    });
 
     it('returns two snakes, if there are one shorter and two with equal length', () => {
        expect(Snake.findLongest(
         { snakeLen1, snakeLen2, snakeLen2Bis }
       ))
      .to.be.ofSize(2).and
      .to.be.containingAllOf([ snakeLen2, snakeLen2Bis ])
     });
  
    it('returns longest snake from group of 5 snakes', () => {
      expect(Snake.findLongest(
         { snakeLen1, snakeLen2, snakeLen2Bis, snakeLen3, snakeLen4 }
       ))
      .to.be.ofSize(1).and
      .to.be.containingAllOf([ snakeLen4 ])
    })

  })
})