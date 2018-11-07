"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
const Rx = __importStar(require("rxjs/Rx"));
const Snake_1 = __importDefault(require("./Snake"));
const events_1 = require("events");
const lodash_1 = require("lodash");
const delay_1 = __importDefault(require("delay"));
const readLevelMap_1 = __importDefault(require("./utils/readLevelMap"));
const findLongestSnake = Snake_1.default.findLongest;
class Arena extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.size = [0, 0];
        this.food = [];
        this.snakes = {};
        this.startingPoints = [];
    }
    startSnakes() {
        this.stopSnakes();
        this.snakesMovingInterval = setInterval(() => {
            this.eachSnake((snake) => snake.move());
            this.eachSnake((snake) => this.checkSnakePosition(snake));
            this.stream('snakesFields', 'food');
        }, this.tempo);
    }
    stopSnakes() {
        clearInterval(this.snakesMovingInterval);
    }
    toStream() {
        return Rx.Observable.fromEvent(this, 'stream');
    }
    stream(...data) {
        const dataToStream = data.reduce((acc, value) => {
            let parsedValue;
            if (typeof value === 'string') {
                parsedValue = { [value]: this[value] };
            }
            else {
                parsedValue = value;
            }
            return Object.assign({}, acc, parsedValue);
        }, {});
        this.emit('stream', dataToStream);
    }
    streamEverything() {
        this.stream('size', 'obstacles', 'food', 'foodLeft', 'snakesFields', 'snakesDetails');
    }
    registerSnake(snake) {
        this.snakes[snake.id] = snake;
        snake.born(this.startingPoints[0]);
        this.streamEverything();
        if (!this.gameIsOn) {
            this.beginGame();
        }
    }
    checkSnakePosition(snake) {
        const whatsOnField = this.checkField(snake.head, snake);
        switch (whatsOnField) {
            case 'food':
                snake.obtainFood(this.grow);
                this.foodLeft--;
                this.stream('foodLeft', 'snakesDetails');
                this.removeFood(snake.head);
                if (this.foodLeft === 0) {
                    this.levelCompleted();
                }
                else {
                    this.putFootOnTheBoard();
                }
                break;
            case 'obstacle':
            case 'snake':
                this.killSnake(snake);
            default:
        }
        return this;
    }
    killSnake(snake) {
        snake.die();
        delete this.snakes[snake.id];
        this.streamEverything();
        if (!this.hasAnySnakes) {
            this.gameIsOn = false;
            this.stopSnakes();
        }
    }
    removeFood(point) {
        this.food = this.food.filter((foodPoint) => {
            return !Arena.comparePoints(foodPoint, point);
        });
    }
    getSnakes() {
        return Object.values(this.snakes);
    }
    eachSnake(fn) {
        return this.getSnakes().map(fn);
    }
    get hasAnySnakes() {
        return this.getSnakes().length > 0;
    }
    get snakesFields() {
        return this.eachSnake((snake) => {
            return snake.fields || [];
        }).flat() || [];
    }
    get snakesDetails() {
        return this.eachSnake((snake) => snake.provideDetails());
    }
    checkField(field, snake) {
        const isOnField = (comparedPoint) => Arena.comparePoints(comparedPoint, field);
        if (this.food.some(isOnField)) {
            return 'food';
        }
        if (this.obstacles.some(isOnField)) {
            return 'obstacle';
        }
        if ((snake
            ? (lodash_1.without(this.snakesFields, snake.head))
            : this.snakesFields).some(isOnField)) {
            return 'snake';
        }
        return null;
    }
    putFootOnTheBoard() {
        this.food.push(lodash_1.sample(this.foodSpots));
    }
    levelCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stopSnakes();
            this.emit('completed');
            yield this.anounceAndRewardWinner();
            this.nextLevel();
        });
    }
    anounceAndRewardWinner() {
        return __awaiter(this, void 0, void 0, function* () {
            const winners = findLongestSnake(this.snakes);
            winners.forEach(snake => snake.obtainTrophy());
            this.stream('snakesDetails');
            yield this.shout(this.generateWinnerMessage(winners), 2500);
            this.stream({ message: null });
        });
    }
    generateWinnerMessage(snakesWinners) {
        return snakesWinners.map(snake => snake.name).join(' and ') + ' wins';
    }
    nextLevel() {
        if (this.levelsGenerator) {
            const { done, value } = this.levelsGenerator.next();
            if (done) {
                this.allLevelsCompleted();
            }
            else {
                this.useLevel(value);
            }
        }
    }
    allLevelsCompleted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.snakes = {};
            this.streamEverything();
            this.stream({
                message: "That's it for today! Come back later!",
            });
        });
    }
    static comparePoints(point1, point2) {
        return point1.toString() === point2.toString();
    }
    useLevelsGenerator(levelsGenerator) {
        this.levelsGenerator = levelsGenerator;
        this.useLevel(levelsGenerator.next().value);
        return this;
    }
    useLevel([levelMap, { tempo: levelTempo = 150, food: levelFood = 15, grow: levelGrow = 1, } = {}]) {
        this.gameIsOn = false;
        const mapData = readLevelMap_1.default(levelMap);
        this.size = mapData.size;
        this.startingPoints = mapData.startingPoints;
        this.obstacles = mapData.obstacles;
        this.foodSpots = mapData.foodSpots;
        this.tempo = levelTempo;
        this.foodLeft = levelFood;
        this.grow = levelGrow;
        this.putFootOnTheBoard();
        if (this.hasAnySnakes) {
            this.rebornSnakes();
            this.beginGame();
        }
        this.streamEverything();
        return this;
    }
    rebornSnakes() {
        this.eachSnake((snake, snakeIndex) => {
            snake.born(this.startingPoints[snakeIndex]);
        });
    }
    beginGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.gameIsOn) {
                this.gameIsOn = true;
                this.countdown()
                    .then(() => this.startSnakes());
            }
        });
    }
    countdown() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 3; i > 0; i--) {
                yield this.shout(i.toString(), 1000);
            }
            yield this.shout('Go Snakes', 1000);
            this.stream({ message: null });
            yield delay_1.default(100);
        });
    }
    shout(message, time) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stream({ message });
            yield delay_1.default(time);
        });
    }
}
function deliverMail() {
    return new Promise((resolve, reject) => {
    });
}
module.exports = Arena;
//# sourceMappingURL=Arena.js.map