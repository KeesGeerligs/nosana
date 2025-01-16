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
exports.application_plugin = void 0;
/**
 * @internal
 */
var application_plugin = function (schema, tags) {
    var plugins = tags
        .map(function (row) { return row.filter(function (t) { return t.schema !== undefined; }); })
        .filter(function (row) { return row.length !== 0; });
    if (plugins.length === 0)
        return [schema];
    return plugins.map(function (row) {
        var e_1, _a;
        var base = __assign({}, schema);
        try {
            for (var row_1 = __values(row), row_1_1 = row_1.next(); !row_1_1.done; row_1_1 = row_1.next()) {
                var tag = row_1_1.value;
                Object.assign(base, tag.schema);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (row_1_1 && !row_1_1.done && (_a = row_1.return)) _a.call(row_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return base;
    });
};
exports.application_plugin = application_plugin;
//# sourceMappingURL=application_plugin.js.map