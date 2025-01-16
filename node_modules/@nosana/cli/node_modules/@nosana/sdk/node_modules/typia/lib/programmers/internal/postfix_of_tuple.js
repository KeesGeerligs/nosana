"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postfix_of_tuple = void 0;
var postfix_of_tuple = function (str) {
    return str.endsWith('"') ? str.slice(0, -1) : "".concat(str, " + \"");
};
exports.postfix_of_tuple = postfix_of_tuple;
//# sourceMappingURL=postfix_of_tuple.js.map