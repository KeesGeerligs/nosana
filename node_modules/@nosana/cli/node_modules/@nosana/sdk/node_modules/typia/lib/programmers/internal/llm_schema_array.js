"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llm_schema_array = void 0;
var application_plugin_1 = require("./application_plugin");
var llm_schema_station_1 = require("./llm_schema_station");
/**
 * @internal
 */
var llm_schema_array = function (array) {
    return (0, application_plugin_1.application_plugin)({
        type: "array",
        items: (0, llm_schema_station_1.llm_schema_station)({
            metadata: array.type.value,
            blockNever: false,
            attribute: {},
        }),
    }, array.tags);
};
exports.llm_schema_array = llm_schema_array;
//# sourceMappingURL=llm_schema_array.js.map