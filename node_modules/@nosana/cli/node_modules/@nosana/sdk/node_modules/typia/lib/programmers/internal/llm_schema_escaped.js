"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm_schema_escaped = void 0;
var llm_schema_station_1 = require("./llm_schema_station");
/**
 * @internal
 */
var llm_schema_escaped = function (escaped) {
    var output = (0, llm_schema_station_1.llm_schema_station)({
        metadata: escaped.returns,
        blockNever: false,
        attribute: {},
    });
    if (output === null)
        return [];
    else if (is_date(new Set())(escaped.original)) {
        var string = is_string(output)
            ? output
            : is_one_of(output)
                ? output.oneOf.find(is_string)
                : undefined;
        if (string !== undefined &&
            string.format !== "date" &&
            string.format !== "date-time")
            string.format = "date-time";
    }
    return is_one_of(output) ? output.oneOf : [output];
};
exports.llm_schema_escaped = llm_schema_escaped;
/**
 * @internal
 */
var is_string = function (elem) {
    return elem.type === "string";
};
/**
 * @internal
 */
var is_one_of = function (elem) {
    return Array.isArray(elem.oneOf);
};
/**
 * @internal
 */
var is_date = function (visited) {
    return function (meta) {
        if (visited.has(meta))
            return false;
        visited.add(meta);
        return (meta.natives.some(function (name) { return name === "Date"; }) ||
            meta.arrays.some(function (array) { return is_date(visited)(array.type.value); }) ||
            meta.tuples.some(function (tuple) { return tuple.type.elements.some(is_date(visited)); }) ||
            meta.aliases.some(function (alias) { return is_date(visited)(alias.value); }));
    };
};
//# sourceMappingURL=llm_schema_escaped.js.map