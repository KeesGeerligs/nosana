"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v31_tuple = void 0;
/**
 * @internal
 */
var application_v31_tuple = function (generator) {
    return function (tuple) {
        var _a, _b;
        var tail = (_b = (_a = tuple.type.elements.at(-1)) === null || _a === void 0 ? void 0 : _a.rest) !== null && _b !== void 0 ? _b : null;
        var prefixItems = tuple.type.isRest()
            ? tuple.type.elements.slice(0, -1)
            : tuple.type.elements;
        return {
            type: "array",
            prefixItems: prefixItems.map(generator),
            additionalItems: tail ? generator(tail) : false,
        };
    };
};
exports.application_v31_tuple = application_v31_tuple;
//# sourceMappingURL=application_v31_tuple.js.map