"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_number = void 0;
var application_plugin_1 = require("./application_plugin");
/**
 * @internal
 */
var application_number = function (atomic) {
    return (0, application_plugin_1.application_plugin)({
        type: "number",
    }, atomic.tags);
};
exports.application_number = application_number;
//# sourceMappingURL=application_number.js.map