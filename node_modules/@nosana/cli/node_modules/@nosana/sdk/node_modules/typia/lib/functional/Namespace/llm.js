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
exports.application = void 0;
var LlmSchemaSeparator_1 = require("@samchon/openapi/lib/utils/LlmSchemaSeparator");
var application = function () { return ({
    finalize: function (app, options) {
        var e_1, _a;
        var _b;
        app.options = {
            separate: (_b = options === null || options === void 0 ? void 0 : options.separate) !== null && _b !== void 0 ? _b : null,
        };
        if (app.options.separate === null)
            return;
        try {
            for (var _c = __values(app.functions), _d = _c.next(); !_d.done; _d = _c.next()) {
                var func = _d.value;
                func.separated = LlmSchemaSeparator_1.LlmSchemaSeparator.parameters({
                    parameters: func.parameters,
                    predicator: app.options.separate,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    },
}); };
exports.application = application;
//# sourceMappingURL=llm.js.map