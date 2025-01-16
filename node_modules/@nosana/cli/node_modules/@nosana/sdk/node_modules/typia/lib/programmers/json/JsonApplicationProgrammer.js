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
exports.JsonApplicationProgrammer = void 0;
var TransformerError_1 = require("../../transformers/TransformerError");
var AtomicPredicator_1 = require("../helpers/AtomicPredicator");
var application_v30_schema_1 = require("../internal/application_v30_schema");
var application_v31_schema_1 = require("../internal/application_v31_schema");
var JsonApplicationProgrammer;
(function (JsonApplicationProgrammer) {
    JsonApplicationProgrammer.validate = function (meta) {
        var e_1, _a;
        var output = [];
        if (meta.atomics.some(function (a) { return a.type === "bigint"; }) ||
            meta.constants.some(function (c) { return c.type === "bigint"; }))
            output.push("JSON schema does not support bigint type.");
        if (meta.tuples.some(function (t) {
            return t.type.elements.some(function (e) { return e.isRequired() === false; });
        }) ||
            meta.arrays.some(function (a) { return a.type.value.isRequired() === false; }))
            output.push("JSON schema does not support undefined type in array.");
        if (meta.maps.length)
            output.push("JSON schema does not support Map type.");
        if (meta.sets.length)
            output.push("JSON schema does not support Set type.");
        try {
            for (var _b = __values(meta.natives), _c = _b.next(); !_c.done; _c = _b.next()) {
                var native = _c.value;
                if (AtomicPredicator_1.AtomicPredicator.native(native) === false &&
                    native !== "Date" &&
                    native !== "Blob" &&
                    native !== "File")
                    output.push("JSON schema does not support ".concat(native, " type."));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return output;
    };
    JsonApplicationProgrammer.write = function (version) {
        return version === "3.0" ? v30 : v31;
    };
    var v30 = function (metadatas) {
        var components = {};
        var generator = function (meta) {
            return (0, application_v30_schema_1.application_v30_schema)(true)(components)({})(meta);
        };
        return {
            version: "3.0",
            components: components,
            schemas: metadatas.map(function (meta, i) {
                var schema = generator(meta);
                if (schema === null)
                    throw new TransformerError_1.TransformerError({
                        code: "typia.json.application",
                        message: "invalid type on argument - (".concat(meta.getName(), ", ").concat(i, ")"),
                    });
                return schema;
            }),
        };
    };
    var v31 = function (metadatas) {
        var components = {
            schemas: {},
        };
        var generator = function (meta) {
            return (0, application_v31_schema_1.application_v31_schema)(true)(components)({})(meta);
        };
        return {
            version: "3.1",
            components: components,
            schemas: metadatas.map(function (meta, i) {
                var schema = generator(meta);
                if (schema === null)
                    throw new TransformerError_1.TransformerError({
                        code: "typia.json.application",
                        message: "invalid type on argument - (".concat(meta.getName(), ", ").concat(i, ")"),
                    });
                return schema;
            }),
        };
    };
})(JsonApplicationProgrammer || (exports.JsonApplicationProgrammer = JsonApplicationProgrammer = {}));
//# sourceMappingURL=JsonApplicationProgrammer.js.map