"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmSchemaTransformer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var LiteralFactory_1 = require("../../../factories/LiteralFactory");
var MetadataCollection_1 = require("../../../factories/MetadataCollection");
var MetadataFactory_1 = require("../../../factories/MetadataFactory");
var LlmSchemaProgrammer_1 = require("../../../programmers/llm/LlmSchemaProgrammer");
var TransformerError_1 = require("../../TransformerError");
var LlmSchemaTransformer;
(function (LlmSchemaTransformer) {
    LlmSchemaTransformer.transform = function (project) {
        return function (expression) {
            var _a;
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
                validate: LlmSchemaProgrammer_1.LlmSchemaProgrammer.validate,
            })(collection)(type);
            if (result.success === false)
                throw TransformerError_1.TransformerError.from("typia.llm.schema")(result.errors);
            // GENERATE LLM SCHEMA
            var schema = LlmSchemaProgrammer_1.LlmSchemaProgrammer.write(result.data);
            return LiteralFactory_1.LiteralFactory.generate(schema);
        };
    };
})(LlmSchemaTransformer || (exports.LlmSchemaTransformer = LlmSchemaTransformer = {}));
//# sourceMappingURL=LlmSchemaTransformer.js.map