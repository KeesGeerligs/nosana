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
exports.llm_schema_tuple = void 0;
var Metadata_1 = require("../../schemas/metadata/Metadata");
var llm_schema_station_1 = require("./llm_schema_station");
/**
 * @internal
 */
var llm_schema_tuple = function (props) {
    var _a, _b;
    return (__assign(__assign({}, props.attribute), { type: "array", items: (0, llm_schema_station_1.llm_schema_station)({
            blockNever: false,
            attribute: props.attribute,
            metadata: props.tuple.type.elements.reduce(function (x, y) { var _a, _b; return Metadata_1.Metadata.merge((_a = x.rest) !== null && _a !== void 0 ? _a : x, (_b = y.rest) !== null && _b !== void 0 ? _b : y); }, Metadata_1.Metadata.initialize()),
        }), minItems: !!((_a = props.tuple.type.elements.at(-1)) === null || _a === void 0 ? void 0 : _a.rest)
            ? props.tuple.type.elements.length - 1
            : props.tuple.type.elements.filter(function (x) { return !x.optional; }).length, maxItems: !!((_b = props.tuple.type.elements.at(-1)) === null || _b === void 0 ? void 0 : _b.rest)
            ? undefined
            : props.tuple.type.elements.length }));
};
exports.llm_schema_tuple = llm_schema_tuple;
//# sourceMappingURL=llm_schema_tuple.js.map