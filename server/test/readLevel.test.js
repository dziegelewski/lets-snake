const readLevelMap = require('../utils/readLevelMap');


const level = [[
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'x                            x',
'x    o                  o    x',
'x                            x',
'x                            x',
'x                            x',
'x             o              x',
'x                            x',
'x                            x',
'x                            x',
'x     R              D       x',
'x             o              x',
'x                            x',
'x            xxx             x',
'x            x x             x',
'x            xxx             x',
'x                            x',
'x             o              x',
'x                            x',
'x                            x',
'x     U              l       x',
'x                            x',
'x             o              x',
'x                            x',
'x                            x',
'x                            x',
'x     o        o       o     x',
'x                            x',
'x                            x',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
], { food: 10 }],




describe('readLevelMawp', () => {

  it('should return correct width and height', () => {
    readLevelMap(level).should.be.equal(2);
  })
})
