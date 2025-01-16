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
exports.MiscAssertPruneProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var IdentifierFactory_1 = require("../../factories/IdentifierFactory");
var StatementFactory_1 = require("../../factories/StatementFactory");
var TypeFactory_1 = require("../../factories/TypeFactory");
var AssertProgrammer_1 = require("../AssertProgrammer");
var FeatureProgrammer_1 = require("../FeatureProgrammer");
var FunctionImporter_1 = require("../helpers/FunctionImporter");
var MiscPruneProgrammer_1 = require("./MiscPruneProgrammer");
var MiscAssertPruneProgrammer;
(function (MiscAssertPruneProgrammer) {
    MiscAssertPruneProgrammer.decompose = function (props) {
        var _a;
        var assert = AssertProgrammer_1.AssertProgrammer.decompose(__assign(__assign({}, props), { equals: false, guard: false }));
        var prune = MiscPruneProgrammer_1.MiscPruneProgrammer.decompose(__assign(__assign({}, props), { validated: true }));
        return {
            functions: __assign(__assign({}, assert.functions), prune.functions),
            statements: __spreadArray(__spreadArray(__spreadArray([], __read(assert.statements), false), __read(prune.statements), false), [
                StatementFactory_1.StatementFactory.constant("__assert", assert.arrow),
                StatementFactory_1.StatementFactory.constant("__prune", prune.arrow),
            ], false),
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, [
                IdentifierFactory_1.IdentifierFactory.parameter("input", TypeFactory_1.TypeFactory.keyword("any")),
                AssertProgrammer_1.AssertProgrammer.Guardian.parameter(props.init),
            ], typescript_1.default.factory.createTypeReferenceNode((_a = props.name) !== null && _a !== void 0 ? _a : TypeFactory_1.TypeFactory.getFullName(props.project.checker)(props.type)), undefined, typescript_1.default.factory.createBlock([
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createBinaryExpression(typescript_1.default.factory.createIdentifier("input"), typescript_1.default.SyntaxKind.EqualsToken, typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__assert"), undefined, [
                    typescript_1.default.factory.createIdentifier("input"),
                    AssertProgrammer_1.AssertProgrammer.Guardian.identifier(),
                ]))),
                typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("__prune"), undefined, [typescript_1.default.factory.createIdentifier("input")])),
                typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("input")),
            ], true)),
        };
    };
    MiscAssertPruneProgrammer.write = function (project) {
        return function (modulo) {
            return function (type, name, init) {
                var importer = new FunctionImporter_1.FunctionImporter(modulo.getText());
                var result = MiscAssertPruneProgrammer.decompose({
                    project: project,
                    importer: importer,
                    type: type,
                    name: name,
                    init: init,
                });
                return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
                    modulo: modulo,
                    importer: importer,
                    result: result,
                });
            };
        };
    };
})(MiscAssertPruneProgrammer || (exports.MiscAssertPruneProgrammer = MiscAssertPruneProgrammer = {}));
//# sourceMappingURL=MiscAssertPruneProgrammer.js.map