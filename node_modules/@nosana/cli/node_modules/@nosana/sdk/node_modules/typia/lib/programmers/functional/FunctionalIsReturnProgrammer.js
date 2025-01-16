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
exports.FunctionalIsReturnProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var StringUtil_1 = require("../../utils/StringUtil");
var IsProgrammer_1 = require("../IsProgrammer");
var FunctionalIsFunctionProgrammer_1 = require("./FunctionalIsFunctionProgrammer");
var FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalIsReturnProgrammer;
(function (FunctionalIsReturnProgrammer) {
    FunctionalIsReturnProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var result = FunctionalIsReturnProgrammer.decompose(project)(modulo)(equals)(expression, declaration);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(result.async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.getReturnTypeNode(declaration, result.async), undefined, typescript_1.default.factory.createBlock(result.statements, true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalIsReturnProgrammer.decompose = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var _a = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType(project.checker)(declaration), type = _a.type, async = _a.async;
                    var caller = typescript_1.default.factory.createCallExpression(expression, undefined, declaration.parameters.map(function (p) {
                        return typescript_1.default.factory.createIdentifier(p.name.getText());
                    }));
                    var name = StringUtil_1.StringUtil.escapeDuplicate(declaration.parameters.map(function (p) { return p.name.getText(); }))("result");
                    return {
                        async: async,
                        functions: [
                            StatementFactory_1.StatementFactory.constant("__is_return", IsProgrammer_1.IsProgrammer.write(project)(modulo)(equals)(type)),
                        ],
                        statements: [
                            StatementFactory_1.StatementFactory.constant(name, async ? typescript_1.default.factory.createAwaitExpression(caller) : caller),
                            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is_return"), undefined, [typescript_1.default.factory.createIdentifier(name)]), undefined, typescript_1.default.factory.createIdentifier(name), undefined, typescript_1.default.factory.createNull())),
                        ],
                    };
                };
            };
        };
    };
})(FunctionalIsReturnProgrammer || (exports.FunctionalIsReturnProgrammer = FunctionalIsReturnProgrammer = {}));
//# sourceMappingURL=FunctionalIsReturnProgrammer.js.map