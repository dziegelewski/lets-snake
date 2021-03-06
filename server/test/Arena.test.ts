import { expect } from 'chai';
import { Arena } from '../src/Arena';

describe('Arena', () => {
  describe('stream', () => {

    it('streams values with keys when they are given', (done) => {
      const arena = new Arena();

      arena.on('stream', (streamed) => {

        expect(streamed).to.be.deep.equal({ message: 'Some message', value: 4 });
        done();
      });

      arena.stream({ message: 'Some message' }, { value: 4 });

    });

    it('streams own values with keys when only strings given', (done) => {
      const arena = new Arena();

      arena.foodLeft = 10;
      arena.size = [5, 5];

      arena.on('stream', (streamed) => {

        expect(streamed).to.be.deep.equal({ foodLeft: 10, size: [5, 5] });
        done();
      });

      arena.stream('foodLeft', 'size');
    });


  });
});