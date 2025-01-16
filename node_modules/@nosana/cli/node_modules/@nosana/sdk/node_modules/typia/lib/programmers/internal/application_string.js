"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_string = void 0;
var application_plugin_1 = require("./application_plugin");
/**
 * @internal
 */
var application_string = function (atomic) {
    return (0, application_plugin_1.application_plugin)({
        type: "string",
    }, atomic.tags);
};
exports.application_string = application_string;
//# sourceMappingURL=application_string.js.map