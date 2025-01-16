"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_boolean = void 0;
var application_plugin_1 = require("./application_plugin");
/**
 * @internal
 */
var application_boolean = function (atomic) {
    return (0, application_plugin_1.application_plugin)({
        type: "boolean",
    }, atomic.tags);
};
exports.application_boolean = application_boolean;
//# sourceMappingURL=application_boolean.js.map