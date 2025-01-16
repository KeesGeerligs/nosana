"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmSchemaProgrammer = void 0;
var AtomicPredicator_1 = require("../helpers/AtomicPredicator");
var llm_schema_station_1 = require("../internal/llm_schema_station");
var LlmSchemaProgrammer;
(function (LlmSchemaProgrammer) {
    LlmSchemaProgrammer.validate = function (meta) {
        var e_1, _a;
        var output = [];
        if (meta.atomics.some(function (a) { return a.type === "bigint"; }) ||
            meta.constants.some(function (c) { return c.type === "bigint"; }))
            output.push("LLM schema does not support bigint type.");
        if (meta.tuples.some(function (t) {
            return t.type.elements.some(function (e) { return e.isRequired() === false; });
        }) ||
            meta.arrays.some(function (a) { return a.type.value.isRequired() === false; }))
            output.push("LLM schema does not support undefined type in array.");
        if (meta.maps.length)
            output.push("LLM schema does not support Map type.");
        if (meta.sets.length)
            output.push("LLM schema does not support Set type.");
        try {
            for (var _b = __values(meta.natives), _c = _b.next(); !_c.done; _c = _b.next()) {
                var native = _c.value;
                if (AtomicPredicator_1.AtomicPredicator.native(native) === false &&
                    native !== "Date" &&
                    native !== "Blob" &&
                    native !== "File")
                    output.push("LLM schema does not support ".concat(native, " type."));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (meta.aliases.some(function (a) { return a.recursive; }) ||
            meta.arrays.some(function (a) { return a.type.recursive; }) ||
            meta.objects.some(function (o) { return o.recursive; }) ||
            meta.tuples.some(function (t) { return t.type.recursive; }))
            output.push("LLM schema does not support recursive type.");
        return output;
    };
    LlmSchemaProgrammer.write = function (metadata) {
        return (0, llm_schema_station_1.llm_schema_station)({
            metadata: metadata,
            blockNever: true,
            attribute: {},
        });
    };
})(LlmSchemaProgrammer || (exports.LlmSchemaProgrammer = LlmSchemaProgrammer = {}));
//# sourceMappingURL=LlmSchemaProgrammer.js.map