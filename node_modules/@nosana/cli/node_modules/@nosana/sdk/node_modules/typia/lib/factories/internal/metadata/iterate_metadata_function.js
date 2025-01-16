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
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_function = void 0;
var FunctionalGeneralProgrammer_1 = require("../../../programmers/functional/internal/FunctionalGeneralProgrammer");
var Metadata_1 = require("../../../schemas/metadata/Metadata");
var MetadataFunction_1 = require("../../../schemas/metadata/MetadataFunction");
var MetadataParameter_1 = require("../../../schemas/metadata/MetadataParameter");
var CommentFactory_1 = require("../../CommentFactory");
var TypeFactory_1 = require("../../TypeFactory");
var explore_metadata_1 = require("./explore_metadata");
var iterate_metadata_function = function (checker) {
    return function (options) {
        return function (collection) {
            return function (errors) {
                return function (metadata, type, explore) {
                    var _a, _b;
                    var declaration = TypeFactory_1.TypeFactory.getFunction(type);
                    if (declaration === null)
                        return false;
                    else if (!options.functional) {
                        if (metadata.functions.length === 0)
                            metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                                parameters: [],
                                output: Metadata_1.Metadata.initialize(),
                                async: false,
                            }));
                    }
                    else {
                        var _c = __read(type.getCallSignatures(), 1), signature = _c[0];
                        if (signature === undefined || signature.declaration === undefined)
                            metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                                parameters: [],
                                output: Metadata_1.Metadata.initialize(),
                                async: false,
                            }));
                        else {
                            var async = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType(checker)(declaration).async;
                            metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                                parameters: signature.parameters.map(function (p) {
                                    var _a, _b;
                                    return MetadataParameter_1.MetadataParameter.create({
                                        name: p.name,
                                        type: (0, explore_metadata_1.explore_metadata)(checker)(options)(collection)(errors)(checker.getTypeOfSymbol(p), __assign(__assign({}, explore), { top: false, parameter: p.name })),
                                        description: (_a = CommentFactory_1.CommentFactory.description(p)) !== null && _a !== void 0 ? _a : null,
                                        jsDocTags: (_b = p === null || p === void 0 ? void 0 : p.getJsDocTags()) !== null && _b !== void 0 ? _b : [],
                                    });
                                }),
                                async: async,
                                output: (0, explore_metadata_1.explore_metadata)(checker)(__assign(__assign({}, options), { functional: false }))(collection)(errors)(async
                                    ? ((_b = (_a = checker.getTypeArguments(signature.getReturnType())) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")))
                                    : signature.getReturnType(), __assign(__assign({}, explore), { top: false, output: true })),
                            }));
                        }
                    }
                    return true;
                };
            };
        };
    };
};
exports.iterate_metadata_function = iterate_metadata_function;
//# sourceMappingURL=iterate_metadata_function.js.map