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
exports.FunctionalValidateReturnProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var StringUtil_1 = require("../../utils/StringUtil");
var ValidateProgrammer_1 = require("../ValidateProgrammer");
var FunctionalValidateFunctionProgrammer_1 = require("./FunctionalValidateFunctionProgrammer");
var FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalValidateReturnProgrammer;
(function (FunctionalValidateReturnProgrammer) {
    FunctionalValidateReturnProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var result = FunctionalValidateReturnProgrammer.decompose(project)(modulo)(equals)(expression, declaration);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(result.async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.getReturnTypeNode(declaration, result.async), undefined, typescript_1.default.factory.createBlock(result.statements, true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalValidateReturnProgrammer.decompose = function (project) {
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
                            StatementFactory_1.StatementFactory.constant("__validate_return", ValidateProgrammer_1.ValidateProgrammer.write(project)(modulo)(equals)(type)),
                        ],
                        statements: [
                            StatementFactory_1.StatementFactory.constant(name, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate_return"), undefined, [async ? typescript_1.default.factory.createAwaitExpression(caller) : caller])),
                            typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("success"))), typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("errors")), typescript_1.default.factory.createToken(typescript_1.default.SyntaxKind.EqualsToken), FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.hookErrors({
                                expression: typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(name), typescript_1.default.factory.createIdentifier("errors")),
                                replacer: typescript_1.default.factory.createStringLiteral("$input.return"),
                            })))),
                            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("result")),
                        ],
                    };
                };
            };
        };
    };
})(FunctionalValidateReturnProgrammer || (exports.FunctionalValidateReturnProgrammer = FunctionalValidateReturnProgrammer = {}));
//# sourceMappingURL=FunctionalValidateReturnProgrammer.js.map