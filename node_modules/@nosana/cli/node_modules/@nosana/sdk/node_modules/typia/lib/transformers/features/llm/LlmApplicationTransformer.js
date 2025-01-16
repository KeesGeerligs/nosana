"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmApplicationTransformer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../../../factories/ExpressionFactory");
var IdentifierFactory_1 = require("../../../factories/IdentifierFactory");
var LiteralFactory_1 = require("../../../factories/LiteralFactory");
var MetadataCollection_1 = require("../../../factories/MetadataCollection");
var MetadataFactory_1 = require("../../../factories/MetadataFactory");
var StatementFactory_1 = require("../../../factories/StatementFactory");
var TypeFactory_1 = require("../../../factories/TypeFactory");
var LlmApplicationProgrammer_1 = require("../../../programmers/llm/LlmApplicationProgrammer");
var TransformerError_1 = require("../../TransformerError");
var LlmApplicationTransformer;
(function (LlmApplicationTransformer) {
    LlmApplicationTransformer.transform = function (project) {
        return function (modulo) {
            return function (expression) {
                var _a, _b;
                // GET GENERIC ARGUMENT
                if (!((_a = expression.typeArguments) === null || _a === void 0 ? void 0 : _a.length))
                    throw new TransformerError_1.TransformerError({
                        code: "typia.llm.schema",
                        message: "no generic argument.",
                    });
                var top = expression.typeArguments[0];
                if (typescript_1.default.isTypeNode(top) === false)
                    return expression;
                // GET TYPE
                var type = project.checker.getTypeFromTypeNode(top);
                var collection = new MetadataCollection_1.MetadataCollection({
                    replace: MetadataCollection_1.MetadataCollection.replace,
                });
                var result = MetadataFactory_1.MetadataFactory.analyze(project.checker, project.context)({
                    escape: true,
                    constant: true,
                    absorb: false,
                    functional: true,
                    validate: LlmApplicationProgrammer_1.LlmApplicationProgrammer.validate,
                })(collection)(type);
                if (result.success === false)
                    throw TransformerError_1.TransformerError.from("typia.llm.application")(result.errors);
                // GENERATE LLM APPLICATION
                var schema = LlmApplicationProgrammer_1.LlmApplicationProgrammer.write(result.data);
                var literal = LiteralFactory_1.LiteralFactory.generate(schema);
                if (!((_b = expression.arguments) === null || _b === void 0 ? void 0 : _b[0]))
                    return literal;
                return ExpressionFactory_1.ExpressionFactory.selfCall(typescript_1.default.factory.createBlock([
                    StatementFactory_1.StatementFactory.constant("app", LiteralFactory_1.LiteralFactory.generate(schema)),
                    typescript_1.default.factory.createExpressionStatement(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createAsExpression(IdentifierFactory_1.IdentifierFactory.access(modulo)("finalize"), TypeFactory_1.TypeFactory.keyword("any")), undefined, [typescript_1.default.factory.createIdentifier("app"), expression.arguments[0]])),
                    typescript_1.default.factory.createReturnStatement(typescript_1.default.factory.createIdentifier("app")),
                ], true));
            };
        };
    };
})(LlmApplicationTransformer || (exports.LlmApplicationTransformer = LlmApplicationTransformer = {}));
//# sourceMappingURL=LlmApplicationTransformer.js.map