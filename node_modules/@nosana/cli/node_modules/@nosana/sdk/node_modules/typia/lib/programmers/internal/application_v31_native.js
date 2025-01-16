"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v31_native = void 0;
/**
 * @internal
 */
var application_v31_native = function (components) {
    return function (name) {
        var _a, _b, _c;
        var _d;
        if (name === "Blob" || name === "File")
            return {
                type: "string",
                format: "binary",
            };
        if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[name]) === undefined) {
            (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
            (_c = (_d = components.schemas)[name]) !== null && _c !== void 0 ? _c : (_d[name] = {
                type: "object",
                properties: {},
            });
        }
        return {
            $ref: "#/components/schemas/".concat(name),
        };
    };
};
exports.application_v31_native = application_v31_native;
//# sourceMappingURL=application_v31_native.js.map