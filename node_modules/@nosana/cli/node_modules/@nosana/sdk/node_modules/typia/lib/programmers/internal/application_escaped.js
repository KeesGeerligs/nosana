"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_escaped = void 0;
/**
 * @internal
 */
var application_escaped = function (generator) {
    return function (escaped) {
        var output = generator(escaped.returns);
        if (output === null)
            return [];
        if (is_date(new Set())(escaped.original)) {
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
};
exports.application_escaped = application_escaped;
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
//# sourceMappingURL=application_escaped.js.map