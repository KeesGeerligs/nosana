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
exports.FunctionalIsParametersProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var IsProgrammer_1 = require("../IsProgrammer");
var FunctionalIsFunctionProgrammer_1 = require("./FunctionalIsFunctionProgrammer");
var FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalIsParametersProgrammer;
(function (FunctionalIsParametersProgrammer) {
    FunctionalIsParametersProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var async = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType(project.checker)(declaration).async;
                    var result = FunctionalIsParametersProgrammer.decompose(project)(modulo)(equals)(declaration);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.getReturnTypeNode(declaration, async), undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.statements), false), [
                            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(expression, undefined, declaration.parameters.map(function (p) {
                                return typescript_1.default.factory.createIdentifier(p.name.getText());
                            }))),
                        ], false), true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalIsParametersProgrammer.decompose = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (declaration) { return ({
                    functions: declaration.parameters.map(function (p, i) {
                        var _a;
                        return StatementFactory_1.StatementFactory.constant("__is_param_".concat(i), IsProgrammer_1.IsProgrammer.write(project)(modulo)(equals)(project.checker.getTypeFromTypeNode((_a = p.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any"))));
                    }),
                    statements: declaration.parameters
                        .map(function (p, i) { return [
                        typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is_param_".concat(i)), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())])), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createNull())),
                    ]; })
                        .flat(),
                }); };
            };
        };
    };
})(FunctionalIsParametersProgrammer || (exports.FunctionalIsParametersProgrammer = FunctionalIsParametersProgrammer = {}));
//# sourceMappingURL=FunctionalIsParametersProgrammer.js.map