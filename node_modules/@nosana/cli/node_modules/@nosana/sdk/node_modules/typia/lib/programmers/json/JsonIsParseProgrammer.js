"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.JsonIsParseProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var IdentifierFactory_1 = require("../../factories/IdentifierFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var FeatureProgrammer_1 = require("../FeatureProgrammer");
var IsProgrammer_1 = require("../IsProgrammer");
var FunctionImporter_1 = require("../helpers/FunctionImporter");
var JsonIsParseProgrammer;
(function (JsonIsParseProgrammer) {
    JsonIsParseProgrammer.decompose = function (props) {
        var _a;
        var is = IsProgrammer_1.IsProgrammer.decompose(__assign(__assign({}, props), { project: __assign(__assign({}, props.project), { options: __assign(__assign({}, props.project.options), { functional: false, numeric: false }) }), equals: false }));
        return {
            functions: is.functions,
            statements: __spreadArray(__spreadArray([], __read(is.statements), false), [
                StatementFactory_1.StatementFactory.constant("__is", is.arrow),
            ], false),
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("string"))], typescript_1.default.factory.createUnionTypeNode([
                typescript_1.default.factory.createImportTypeNode(typescript_1.default.factory.createLiteralTypeNode(typescript_1.default.factory.createStringLiteral("typia")), undefined, typescript_1.default.factory.createIdentifier("Primitive"), [
                    typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName(props.project.checker)(props.type)),
                ], false),
                typescript_1.default.factory.createTypeReferenceNode("null"),
            ]), undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("input"), typescript_1.default.SyntaxKind.EqualsToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("JSON.parse"), undefined, [typescript_1.default.factory.createIdentifier("input")]))),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createConditionalExpression(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__is"), undefined, [typescript_1.default.factory.createIdentifier("input")]), undefined, typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createIdentifier("input"), TypeFactory_1.TypeFactory.keyword("any")), undefined, typescript_1.default.factory.createNull())),
            ])),
        };
    };
    JsonIsParseProgrammer.write = function (project) {
        return function (modulo) {
            return function (type, name) {
                var importer = new FunctionImporter_1.FunctionImporter(modulo.getText());
                var result = JsonIsParseProgrammer.decompose({
                    project: project,
                    importer: importer,
                    type: type,
                    name: name,
                });
                return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
                    modulo: modulo,
                    importer: importer,
                    result: result,
                });
            };
        };
    };
})(JsonIsParseProgrammer || (exports.JsonIsParseProgrammer = JsonIsParseProgrammer = {}));
//# sourceMappingURL=JsonIsParseProgrammer.js.map