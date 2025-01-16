"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm_schema_native = void 0;
/**
 * @internal
 */
var llm_schema_native = function (name) {
    return name === "Blob" || name === "File"
        ? {
            type: "string",
            format: "binary",
        }
        : {
            type: "object",
            properties: {},
        };
};
exports.llm_schema_native = llm_schema_native;
//# sourceMappingURL=llm_schema_native.js.map