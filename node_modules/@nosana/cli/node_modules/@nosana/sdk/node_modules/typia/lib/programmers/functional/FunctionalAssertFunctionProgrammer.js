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
exports.FunctionalAssertFunctionProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var IdentifierFactory_1 = require("../../factories/IdentifierFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var StringUtil_1 = require("../../utils/StringUtil");
var AssertProgrammer_1 = require("../AssertProgrammer");
var FunctionalAssertParametersProgrammer_1 = require("./FunctionalAssertParametersProgrammer");
var FunctionalAssertReturnProgrammer_1 = require("./FunctionalAssertReturnProgrammer");
var FunctionalAssertFunctionProgrammer;
(function (FunctionalAssertFunctionProgrammer) {
    FunctionalAssertFunctionProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration, init) {
                    var wrapper = FunctionalAssertFunctionProgrammer.errorFactoryWrapper(modulo)(declaration.parameters)(init);
                    var p = FunctionalAssertParametersProgrammer_1.FunctionalAssertParametersProgrammer.decompose(project)(modulo)(equals)(declaration.parameters, wrapper.name);
                    var r = FunctionalAssertReturnProgrammer_1.FunctionAssertReturnProgrammer.decompose(project)(modulo)(equals)(expression, declaration, wrapper.name);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray(__spreadArray([
                        wrapper.variable
                    ], __read(p.functions), false), __read(r.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, declaration.type, undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(p.expressions.map(typescript_1.default.factory.createExpressionStatement)), false), [
                            typescript_1.default.factory.createReturnStatement(r.value),
                        ], false)))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalAssertFunctionProgrammer.errorFactoryWrapper = function (modulo) {
        return function (paramters) {
            return function (init) {
                var name = StringUtil_1.StringUtil.escapeDuplicate(paramters.map(function (p) { return p.name.getText(); }))("errorFactoryWrapper");
                var variable = typescript_1.default.factory.createVariableStatement(undefined, typescript_1.default.factory.createVariableDeclarationList([
                    typescript_1.default.factory.createVariableDeclaration(name, undefined, AssertProgrammer_1.AssertProgrammer.Guardian.type(), init !== null && init !== void 0 ? init : typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createAsExpression(modulo, TypeFactory_1.TypeFactory.keyword("any")), "errorFactory")),
                ], typescript_1.default.NodeFlags.Const));
                return { name: name, variable: variable };
            };
        };
    };
    FunctionalAssertFunctionProgrammer.hookPath = function (props) {
        return typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("p")], undefined, undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier(props.wrapper), undefined, [
            typescript_1.default.factory.createObjectLiteralExpression([
                typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("p")),
                typescript_1.default.factory.createPropertyAssignment("path", typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("p"), "path"), undefined, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("p"), "path"), "replace"), undefined, [
                    typescript_1.default.factory.createStringLiteral("$input"),
                    typescript_1.default.factory.createStringLiteral(props.replacer),
                ]), undefined, typescript_1.default.factory.createIdentifier("undefined"))),
            ]),
        ]));
    };
})(FunctionalAssertFunctionProgrammer || (exports.FunctionalAssertFunctionProgrammer = FunctionalAssertFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalAssertFunctionProgrammer.js.map