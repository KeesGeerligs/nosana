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
exports.FunctionalAssertParametersProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var AssertProgrammer_1 = require("../AssertProgrammer");
var FunctionalAssertFunctionProgrammer_1 = require("./FunctionalAssertFunctionProgrammer");
var FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalAssertParametersProgrammer;
(function (FunctionalAssertParametersProgrammer) {
    FunctionalAssertParametersProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration, init) {
                    var wrapper = FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.errorFactoryWrapper(modulo)(declaration.parameters)(init);
                    var async = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType(project.checker)(declaration).async;
                    var result = FunctionalAssertParametersProgrammer.decompose(project)(modulo)(equals)(declaration.parameters, wrapper.name);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([
                        wrapper.variable
                    ], __read(result.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, declaration.type, undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.expressions.map(typescript_1.default.factory.createExpressionStatement)), false), [
                            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createCallExpression(expression, undefined, declaration.parameters.map(function (p) {
                                return typescript_1.default.factory.createIdentifier(p.name.getText());
                            }))),
                        ], false), true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalAssertParametersProgrammer.decompose = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (parameters, wrapper) { return ({
                    functions: parameters.map(function (p, i) {
                        return StatementFactory_1.StatementFactory.constant("__assert_param_".concat(i), AssertProgrammer_1.AssertProgrammer.write(project)(modulo)(equals)(p.type
                            ? project.checker.getTypeFromTypeNode(p.type)
                            : project.checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")), undefined, FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.hookPath({
                            wrapper: wrapper,
                            replacer: "$input.parameters[".concat(i, "]"),
                        })));
                    }),
                    expressions: parameters.map(function (p, i) {
                        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert_param_".concat(i)), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())]);
                    }),
                }); };
            };
        };
    };
})(FunctionalAssertParametersProgrammer || (exports.FunctionalAssertParametersProgrammer = FunctionalAssertParametersProgrammer = {}));
//# sourceMappingURL=FunctionalAssertParametersProgrammer.js.map