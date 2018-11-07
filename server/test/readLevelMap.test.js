const readLevelMap = require('../dist/utils/readLevelMap').default;

const levelMap = [
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'x    o       L    L     o    x',
'x            R    R          x',
'x            U    U          x',
'x    o       D    D     o    x',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
];


describe('readLevelMawp', () => {

  const readedMap = readLevelMap(levelMap);

  it('returns size correctly', () => {
    expect(readedMap.size).to.be.deep.equal([30, 6]);
  });

  it('returns obstacles correctly', () => {

    expect(readedMap.obstacles).to.be.deep.equal([
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0], [24, 0], [25, 0], [26, 0], [27, 0], [28, 0], [29, 0], [0, 1], [29, 1], [0, 2], [29, 2], [0, 3], [29, 3], [0, 4], [29, 4], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [14, 5], [15, 5], [16, 5], [17, 5], [18, 5], [19, 5], [20, 5], [21, 5], [22, 5], [23, 5], [24, 5], [25, 5], [26, 5], [27, 5], [28, 5], [29, 5] 
    ]);
    
  });

  it('returns foodSpots correctly', () => {
    expect(readedMap.foodSpots).to.be.deep.equal([
      [5, 1], [24, 1], [5, 4], [24, 4]
    ]);
  });

  it('return starting points correctly', () => {
    expect(readedMap.startingPoints).to.be.deep.equal([
      { field: [ 13, 2 ], direction: 'right' },
      { field: [ 18, 2 ], direction: 'right' },
      { field: [ 13, 1 ], direction: 'left' },
      { field: [ 18, 1 ], direction: 'left' },
      { field: [ 13, 3 ], direction: 'up' },
      { field: [ 18, 3 ], direction: 'up' },
      { field: [ 13, 4 ], direction: 'down' },
      { field: [ 18, 4 ], direction: 'down' }
    ])
  });
});
