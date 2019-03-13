import { LevelMap, ILevelConfig, level } from './types';

export const levelsArray: level[] = [
//  [
// 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x       o            o       x',
// 'x                            x',
// 'x                            x',
// 'x            xxx             x',
// 'x       o    x x     o       x',
// 'x            xxx             x',
// 'x                            x',
// 'x       o            o       x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x                            x',
// 'x             o              x',
// 'x                            x',
// 'x                            x',
// 'x             o              x',
// 'x                            x',
// 'x                            x',
// 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
// ],


[[
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



[[
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'x                                         x',
'x                                         x',
'x           R                             x',
'x                                         x',
'x                                         x',
'x                                         x',
'x                   xxxxxxxxxxx      D    x',
'x                   x                     x',
'x          o    o   x    o    o           x',
'x                   x                     x',
'x   U      o    o   x    o    o           x',
'x                   x                     x',
'x                   x                     x',
'x          xxxxxxxxxx                     x',
'x                                         x',
'x          o     o                        x',
'x                       L                 x',
'x                                         x',
'x                                         x',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
], { food: 15 }],


[[
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'x                                                        x',
'x                          o      o                      x',
'x  o    R        o                      o      L     o   x',
'x                                                        x',
'x                                                        x',
'x  o    R       o          o      o            l     o   x',
'x                                                        x',
'x                                                        x',
'x                                                        x',
'x                                                        x',
'x                          o      o                      x',
'x  o    R        o                      o      L     o   x',
'x                                                        x',
'x                                                        x',
'x  o    R       o          o      o            l     o   x',
'x                                                        x',
'x                                                        x',
'x                                                        x',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
], { food: 20, tempo: 100, }],


[[
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
'x                                         x',
'x                                    L    x',
'x     R        o    o       o             x',
'x                                         x',
'x  x  x  x  x  x  x  x  x  x  x  x  x  x  x',
'x                                         x',
'x    o         o              o      o    x',
'x                                         x',
'x  x  x  x  x  x  x  x  x  x  x  x  x  x  x',
'x                                         x',
'x    o         o                      o   x',
'x                                         x',
'x  x  x  x  x  x  x  x  x  x  x  x  x  x  x',
'x                                         x',
'x     R                                   x',
'x              o    o       o       L     x',
'x                                         x',
'x                                         x',
'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
]],
];

export const levelsSequence = (function*(levels) {
  for (let lap = 0; lap < Infinity; lap++) {
    for (let i = 0; i < levels.length; i++) {
      yield difficulty(levels[i], lap);
    }
  }
})(levelsArray);

const difficulty = (level: level, lap: number): level => {
  const [layout, { food = 20, tempo = 150, grow = 1 } = {}] = level;

  return [
    layout,
    {
      food: food + (5 * lap),
      tempo: tempo * (1 - lap * 0.1),
      grow,
    }
  ]
};

