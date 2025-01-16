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
exports.FunctionalValidateFunctionProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var IdentifierFactory_1 = require("../../factories/IdentifierFactory");
var FunctionalValidateParametersProgrammer_1 = require("./FunctionalValidateParametersProgrammer");
var FunctionalValidateReturnProgrammer_1 = require("./FunctionalValidateReturnProgrammer");
var FunctionalValidateFunctionProgrammer;
(function (FunctionalValidateFunctionProgrammer) {
    FunctionalValidateFunctionProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var p = FunctionalValidateParametersProgrammer_1.FunctionalValidateParametersProgrammer.decompose(project)(modulo)(equals)(declaration);
                    var r = FunctionalValidateReturnProgrammer_1.FunctionalValidateReturnProgrammer.decompose(project)(modulo)(equals)(expression, declaration);
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray(__spreadArray([], __read(p.functions), false), __read(r.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(r.async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalValidateFunctionProgrammer.getReturnTypeNode(declaration, r.async), undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(p.statements), false), __read(r.statements), false), true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalValidateFunctionProgrammer.hookErrors = function (props) {
        return typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(props.expression, "map"), undefined, [
            typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("error")], undefined, undefined, typescript_1.default.factory.createObjectLiteralExpression([
                typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("error")),
                typescript_1.default.factory.createPropertyAssignment("path", typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("error"), "path"), "replace"), undefined, [typescript_1.default.factory.createStringLiteral("$input"), props.replacer])),
            ], true)),
        ]);
    };
    FunctionalValidateFunctionProgrammer.getReturnTypeNode = function (declaration, async) {
        var _a;
        return declaration.type
            ? async
                ? !!((_a = declaration.type.typeArguments) === null || _a === void 0 ? void 0 : _a[0])
                    ? typescript_1.default.factory.createTypeReferenceNode("Promise", [
                        typescript_1.default.factory.createImportTypeNode(typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral("typia")), undefined, typescript_1.default.factory.createIdentifier("IValidation"), [
                            declaration.type
                                .typeArguments[0],
                        ]),
                    ])
                    : undefined
                : typescript_1.default.factory.createImportTypeNode(typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral("typia")), undefined, typescript_1.default.factory.createIdentifier("IValidation"), [declaration.type])
            : undefined;
    };
})(FunctionalValidateFunctionProgrammer || (exports.FunctionalValidateFunctionProgrammer = FunctionalValidateFunctionProgrammer = {}));
//# sourceMappingURL=FunctionalValidateFunctionProgrammer.js.map