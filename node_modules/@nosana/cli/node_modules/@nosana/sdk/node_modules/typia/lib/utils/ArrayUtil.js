"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtil = void 0;
var ArrayUtil;
(function (ArrayUtil) {
    ArrayUtil.has = function (array, pred) {
        return array.some(pred);
    };
    ArrayUtil.add = function (array, value, pred) {
        if (pred === void 0) { pred = function (x, y) { return x === y; }; }
        if (array.some(function (elem) { return pred(elem, value); }))
            return false;
        array.push(value);
        return true;
    };
    ArrayUtil.set = function (array, value, key) {
        if (array.some(function (elem) { return key(elem) === key(value); }))
            return;
        array.push(value);
    };
    ArrayUtil.take = function (array, pred, init) {
        var index = array.findIndex(pred);
        if (index !== -1)
            return array[index];
        var elem = init();
        array.push(elem);
        return elem;
    };
    ArrayUtil.repeat = function (count, closure) { return new Array(count).fill("").map(function (_, index) { return closure(index, count); }); };
})(ArrayUtil || (exports.ArrayUtil = ArrayUtil = {}));
//# sourceMappingURL=ArrayUtil.js.map