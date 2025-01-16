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
exports.FunctionalValidateParametersProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../factories/ExpressionFactory");
var IdentifierFactory_1 = require("../../factories/IdentifierFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var StringUtil_1 = require("../../utils/StringUtil");
var ValidateProgrammer_1 = require("../ValidateProgrammer");
var FunctionalValidateFunctionProgrammer_1 = require("./FunctionalValidateFunctionProgrammer");
var FunctionalGeneralProgrammer_1 = require("./internal/FunctionalGeneralProgrammer");
var FunctionalValidateParametersProgrammer;
(function (FunctionalValidateParametersProgrammer) {
    FunctionalValidateParametersProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (expression, declaration) {
                    var async = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType(project.checker)(declaration).async;
                    var result = FunctionalValidateParametersProgrammer.decompose(project)(modulo)(equals)(declaration);
                    var caller = typescript_1.default.factory.createCallExpression(expression, undefined, declaration.parameters.map(function (p) {
                        return typescript_1.default.factory.createIdentifier(p.name.getText());
                    }));
                    return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.functions), false), [
                        typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createArrowFunction(async
                            ? [typescript_1.default.factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)]
                            : undefined, undefined, declaration.parameters, FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.getReturnTypeNode(declaration, async), undefined, typescript_1.default.factory.createBlock(__spreadArray(__spreadArray([], __read(result.statements), false), [
                            typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createObjectLiteralExpression([
                                typescript_1.default.factory.createPropertyAssignment("success", typescript_1.default.factory.createTrue()),
                                typescript_1.default.factory.createPropertyAssignment("data", async
                                    ? typescript_1.default.factory.createAwaitExpression(caller)
                                    : caller),
                                typescript_1.default.factory.createPropertyAssignment("errors", typescript_1.default.factory.createArrayLiteralExpression([])),
                            ], true)),
                        ], false), true))),
                    ], false), true));
                };
            };
        };
    };
    FunctionalValidateParametersProgrammer.decompose = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (declaration) {
                    var resultName = StringUtil_1.StringUtil.escapeDuplicate(declaration.parameters.map(function (p) { return p.name.getText(); }))("paramErrorResults");
                    var validationResultArray = typescript_1.default.factory.createArrayLiteralExpression(declaration.parameters.map(function (p, i) {
                        return typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__validate_param_".concat(i)), undefined, [typescript_1.default.factory.createIdentifier(p.name.getText())]), typescript_1.default.factory.createImportTypeNode(typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral("typia")), undefined, typescript_1.default.factory.createQualifiedName(typescript_1.default.factory.createIdentifier("IValidation"), typescript_1.default.factory.createIdentifier("IFailure")), undefined, false));
                    }), true);
                    var errorMatrix = typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(validationResultArray, "map"), undefined, [
                        typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                            IdentifierFactory_1.IdentifierFactory.parameter("r"),
                            IdentifierFactory_1.IdentifierFactory.parameter("i"),
                        ], undefined, undefined, typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createTrue(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "success")), undefined, typescript_1.default.factory.createIdentifier("r"), undefined, typescript_1.default.factory.createObjectLiteralExpression([
                            typescript_1.default.factory.createSpreadAssignment(typescript_1.default.factory.createIdentifier("r")),
                            typescript_1.default.factory.createPropertyAssignment("errors", FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.hookErrors({
                                expression: typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "errors"),
                                replacer: typescript_1.default.factory.createTemplateExpression(typescript_1.default.factory.createTemplateHead("$input.parameters["), [
                                    typescript_1.default.factory.createTemplateSpan(typescript_1.default.factory.createIdentifier("i"), typescript_1.default.factory.createTemplateTail("]")),
                                ]),
                            })),
                        ], true))),
                    ]);
                    var failures = typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(errorMatrix, "filter"), undefined, [
                        typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("r")], undefined, undefined, typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createFalse(), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier("r"), "success"))),
                    ]);
                    return {
                        functions: declaration.parameters.map(function (p, i) {
                            var _a;
                            return StatementFactory_1.StatementFactory.constant("__validate_param_".concat(i), ValidateProgrammer_1.ValidateProgrammer.write(project)(modulo)(equals)(project.checker.getTypeFromTypeNode((_a = p.type) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.keyword("any"))));
                        }),
                        statements: [
                            StatementFactory_1.StatementFactory.constant(resultName, failures),
                            typescript_1.default.factory.createIfStatement(typescript_1.default.factory.createStrictInequality(typescript_1.default.factory.createNumericLiteral("0"), typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createIdentifier(resultName), "length")), typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createObjectLiteralExpression([
                                typescript_1.default.factory.createPropertyAssignment("success", typescript_1.default.factory.createFalse()),
                                typescript_1.default.factory.createPropertyAssignment("errors", typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier(resultName))("map"), undefined, [
                                    typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                                        IdentifierFactory_1.IdentifierFactory.parameter("r", TypeFactory_1.TypeFactory.keyword("any")),
                                    ], undefined, undefined, IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createIdentifier("r"))("errors")),
                                ]))("flat"), undefined, undefined)),
                            ], true))),
                        ],
                    };
                };
            };
        };
    };
})(FunctionalValidateParametersProgrammer || (exports.FunctionalValidateParametersProgrammer = FunctionalValidateParametersProgrammer = {}));
//# sourceMappingURL=FunctionalValidateParametersProgrammer.js.map