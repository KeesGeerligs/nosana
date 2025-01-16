"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode_union_object = void 0;
var typescript_1 = __importDefault(require("typescript"));
/**
 * @internal
 */
var decode_union_object = function (checker) {
    return function (decoder) {
        return function (success) {
            return function (escaper) {
                return function (input, targets, explore) {
                    return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, iterate(escaper)(input, targets.map(function (obj) { return ({
                        type: "object",
                        is: function () { return success(checker(input, obj, explore)); },
                        value: function () { return decoder(input, obj, explore); },
                    }); }), "(".concat(targets.map(function (t) { return t.name; }).join(" | "), ")"))), undefined, undefined);
                };
            };
        };
    };
};
exports.decode_union_object = decode_union_object;
var iterate = function (escaper) {
    return function (input, unions, expected) {
        var e_1, _a;
        var branches = [];
        try {
            for (var unions_1 = __values(unions), unions_1_1 = unions_1.next(); !unions_1_1.done; unions_1_1 = unions_1.next()) {
                var u = unions_1_1.value;
                var condition = u.is();
                if (condition.kind === typescript_1.default.SyntaxKind.TrueKeyword) {
                    branches.push({
                        condition: null,
                        value: u.value(),
                    });
                    break;
                }
                branches.push({
                    condition: condition,
                    value: u.value(),
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (unions_1_1 && !unions_1_1.done && (_a = unions_1.return)) _a.call(unions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (branches.length === 0)
            return typescript_1.default.factory.createBlock([escaper(input, expected)], true);
        else if (branches.length === 1 && branches[0].condition === null)
            return branches[0].value;
        var statements = branches.map(function (b) {
            return b.condition !== null
                ? typescript_1.default.factory.createIfStatement(b.condition, typescript_1.default.factory.createReturnStatement(b.value), undefined)
                : typescript_1.default.factory.createReturnStatement(b.value);
        });
        if (branches.at(-1).condition !== null)
            statements.push(escaper(input, expected));
        return typescript_1.default.factory.createBlock(statements, true);
    };
};
//# sourceMappingURL=decode_union_object.js.map