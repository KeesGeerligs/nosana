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
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v30_tuple = void 0;
var Metadata_1 = require("../../schemas/metadata/Metadata");
var application_v30_schema_1 = require("./application_v30_schema");
/**
 * @internal
 */
var application_v30_tuple = function (components) {
    return function (tuple) {
        return function (attribute) {
            var _a, _b;
            return (__assign(__assign({}, attribute), { type: "array", items: (0, application_v30_schema_1.application_v30_schema)(false)(components)(tuple.type.recursive ? {} : attribute)(tuple.type.elements.reduce(function (x, y) { var _a, _b; return Metadata_1.Metadata.merge((_a = x.rest) !== null && _a !== void 0 ? _a : x, (_b = y.rest) !== null && _b !== void 0 ? _b : y); }, Metadata_1.Metadata.initialize())), minItems: !!((_a = tuple.type.elements.at(-1)) === null || _a === void 0 ? void 0 : _a.rest)
                    ? tuple.type.elements.length - 1
                    : tuple.type.elements.filter(function (x) { return !x.optional; }).length, maxItems: !!((_b = tuple.type.elements.at(-1)) === null || _b === void 0 ? void 0 : _b.rest)
                    ? undefined
                    : tuple.type.elements.length }));
        };
    };
};
exports.application_v30_tuple = application_v30_tuple;
//# sourceMappingURL=application_v30_tuple.js.map