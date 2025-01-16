"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_bigint = void 0;
var application_plugin_1 = require("./application_plugin");
/**
 * @internal
 */
var application_bigint = function (atomic) {
    return (0, application_plugin_1.application_plugin)({
        type: "integer",
    }, atomic.tags);
};
exports.application_bigint = application_bigint;
//# sourceMappingURL=application_bigint.js.map