"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StartingPoint {
    constructor(field, directionAbbrev) {
        this.field = field;
        this.direction = StartingPoint.directionMap(directionAbbrev);
    }
    static fromArray([field, directionAbbrev]) {
        return new StartingPoint(field, directionAbbrev);
    }
    static directionMap(directionAbbrev) {
        switch (directionAbbrev) {
            case 'L':
                return 'left';
            case 'R':
                return 'right';
            case 'U':
                return 'up';
            case 'D':
                return 'down';
            default:
                throw Error('Incorrect direction');
        }
    }
}
exports.StartingPoint = StartingPoint;
//# sourceMappingURL=StartingPoint.js.map