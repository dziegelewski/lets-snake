Array.prototype.flat = function () {
    return this.reduce((total, item) => {
        if (Array.isArray(item)) {
            total.push(...item);
        }
        else {
            total.push(item);
        }
        return total;
    }, []);
};
Array.prototype.flatMap = function (mapFn) {
    return this.map(mapFn).flat();
};
//# sourceMappingURL=array-prorotype-flat.js.map