"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalGeneralProgrammer = void 0;
var TypeFactory_1 = require("../../../factories/TypeFactory");
var FunctionalGeneralProgrammer;
(function (FunctionalGeneralProgrammer) {
    FunctionalGeneralProgrammer.getReturnType = function (checker) {
        return function (declaration) {
            var _a, _b;
            var signature = checker.getSignatureFromDeclaration(declaration);
            var type = (_a = signature === null || signature === void 0 ? void 0 : signature.getReturnType()) !== null && _a !== void 0 ? _a : checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any"));
            if (((_b = type.symbol) === null || _b === void 0 ? void 0 : _b.name) === "Promise") {
                var generic = checker.getTypeArguments(type);
                return generic.length === 1
                    ? { type: generic[0], async: true }
                    : {
                        type: checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")),
                        async: false,
                    };
            }
            return { type: type, async: false };
        };
    };
})(FunctionalGeneralProgrammer || (exports.FunctionalGeneralProgrammer = FunctionalGeneralProgrammer = {}));
//# sourceMappingURL=FunctionalGeneralProgrammer.js.map