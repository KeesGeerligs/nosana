"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalIsFunctionProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var FunctionalIsParametersProgrammer_1 = require("./FunctionalIsParametersProgrammer");
var FunctionalIsReturnProgrammer_1 = require("./FunctionalIsReturnProgrammer");
var FunctionalIsFunctionProgrammer;
(function (FunctionalIsFunctionProgrammer) {
    FunctionalIsFunctionProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var p = FunctionalIsParametersProgrammer_1.FunctionalIsParametersProgrammer.decompose(project)(modulo)(equals)(declaration);
                    var r = FunctionalIsReturnProgrammer_1.FunctionalIsReturnProgrammer.decompose(project)(modulo)(equals)(expression, declaration);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray(__spreadArray([], __read(p.functions), false), __read(r.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalIsFunctionProgrammer.getReturnTypeNode(declaration, r.async), undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(p.statements), false), __read(r.statements), false), true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalIsFunctionProgrammer.getReturnTypeNode = function (declaration, async) {
        var _a;
        return declaration.type
            ? async
                ? !!((_a = declaration.type.typeArguments) === null || _a === void 0 ? void 0 : _a[0])
                    ? typescript_1.default.factory.createTypeReferenceNode("Promise", [
                        typescript_1.default.factory.createUnionTypeNode([
                            declaration.type.typeArguments[0],
                            typescript_1.default.factory.createTypeReferenceNode("null"),
                        ]),
                    ])
                    : undefined
                : typescript_1.default.factory.createUnionTypeNode([
                    declaration.type,
                    typescript_1.default.factory.createTypeReferenceNode("null"),
                ])
            : undefined;
    };
})(FunctionalIsFunctionProgrammer || (exports.FunctionalIsFunctionProgrammer = FunctionalIsFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalIsFunctionProgrammer.js.map