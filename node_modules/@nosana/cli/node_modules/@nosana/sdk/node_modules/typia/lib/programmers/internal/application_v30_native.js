"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v30_native = void 0;
/**
 * @internal
 */
var application_v30_native = function (components) {
    return function (name) {
        return function (nullable) {
            var _a, _b, _c;
            var _d;
            if (name === "Blob" || name === "File")
                return {
                    type: "string",
                    format: "binary",
                    nullable: nullable,
                };
            var key = "".concat(name).concat(nullable ? ".Nullable" : "");
            if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[key]) === undefined) {
                (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
                (_c = (_d = components.schemas)[key]) !== null && _c !== void 0 ? _c : (_d[key] = {
                    type: "object",
                    properties: {},
                    nullable: nullable,
                });
            }
            return {
                $ref: "#/components/schemas/".concat(key),
            };
        };
    };
};
exports.application_v30_native = application_v30_native;
//# sourceMappingURL=application_v30_native.js.map