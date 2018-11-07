const levels = require('./levels');
function* createLevelsSequence(levels) {
    for (let difficulty = 0; difficulty < Infinity; difficulty++) {
        for (let lvl = 0; lvl < levels.length; lvl++) {
            yield applyDifficulty(levels[lvl], difficulty);
        }
    }
}
const applyDifficulty = (level, difficulty) => {
    const [layout, { food = 20, tempo = 150, grow = 1 } = {}] = level;
    return [
        layout,
        {
            food: food + (5 * difficulty),
            tempo: tempo * (1 - difficulty * 0.1),
            grow,
        }
    ];
};
module.exports = createLevelsSequence(levels);
//# sourceMappingURL=levelsSequence.js.map