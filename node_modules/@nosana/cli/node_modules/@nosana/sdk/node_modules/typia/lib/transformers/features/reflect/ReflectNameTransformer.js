"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectNameTransformer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var MetadataCollection_1 = require("../../../factories/MetadataCollection");
var MetadataFactory_1 = require("../../../factories/MetadataFactory");
var TransformerError_1 = require("../../TransformerError");
var ReflectNameTransformer;
(function (ReflectNameTransformer) {
    ReflectNameTransformer.transform = function (project) {
        return function (expression) {
            var _a;
            if (!((_a = expression.typeArguments) === null || _a === void 0 ? void 0 : _a.length))
                throw new TransformerError_1.TransformerError({
                    code: "typia.reflect.metadata",
                    message: "no generic argument.",
                });
            var top = expression.typeArguments[0];
            var regular = (function () {
                // CHECK SECOND ARGUMENT EXISTENCE
                var second = expression.typeArguments[1];
                if (second === undefined)
                    return false;
                // GET BOOELAN VALUE
                var value = getMetadata(project)(second);
                return value.size() === 1 &&
                    value.constants.length === 1 &&
                    value.constants[0].type === "boolean" &&
                    value.constants[0].values.length === 1
                    ? value.constants[0].values[0].value
                    : false;
            })();
            // RETURNS NAME
            return typescript_1.default.factory.createStringLiteral(regular ? getMetadata(project)(top).getName() : top.getFullText());
        };
    };
})(ReflectNameTransformer || (exports.ReflectNameTransformer = ReflectNameTransformer = {}));
var getMetadata = function (project) {
    return function (node) {
        var type = project.checker.getTypeFromTypeNode(node);
        var collection = new MetadataCollection_1.MetadataCollection({
            replace: MetadataCollection_1.MetadataCollection.replace,
        });
        var result = MetadataFactory_1.MetadataFactory.analyze(project.checker, project.context)({
            escape: false,
            constant: true,
            absorb: false,
        })(collection)(type);
        if (result.success === false)
            throw TransformerError_1.TransformerError.from("typia.reflect.name")(result.errors);
        return result.data;
    };
};
//# sourceMappingURL=ReflectNameTransformer.js.map