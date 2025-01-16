"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalGenericTransformer = void 0;
var TypeFactory_1 = require("../../../factories/TypeFactory");
var TransformerError_1 = require("../../TransformerError");
var FunctionalGenericTransformer;
(function (FunctionalGenericTransformer) {
    FunctionalGenericTransformer.transform = function (props) {
        return function (project) {
            return function (modulo) {
                return function (expression) {
                    // CHECK PARAMETER
                    if (expression.arguments.length === 0)
                        throw new TransformerError_1.TransformerError({
                            code: "typia.functional.".concat(props.method),
                            message: "no input value.",
                        });
                    // GET TYPE INFO
                    var type = expression.typeArguments && expression.typeArguments[0]
                        ? project.checker.getTypeFromTypeNode(expression.typeArguments[0])
                        : project.checker.getTypeAtLocation(expression.arguments[0]);
                    // if (type. === true)
                    //   throw new TransformerError({
                    //     code: `typia.functional.${props.method}`,
                    //     message: `non-specified generic argument.`,
                    //   });
                    // else
                    if (TypeFactory_1.TypeFactory.isFunction(type) === false)
                        throw new TransformerError_1.TransformerError({
                            code: "typia.functional.".concat(props.method),
                            message: "input value is not a function.",
                        });
                    return props.programmer(project)(modulo)(props.equals)(expression.arguments[0], type.symbol.declarations[0], expression.arguments[1]);
                };
            };
        };
    };
})(FunctionalGenericTransformer || (exports.FunctionalGenericTransformer = FunctionalGenericTransformer = {}));
//# sourceMappingURL=FunctionalGenericTransformer.js.map