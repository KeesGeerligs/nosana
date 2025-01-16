"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v31_constant = void 0;
var application_description_1 = require("./application_description");
var application_plugin_1 = require("./application_plugin");
var application_title_1 = require("./application_title");
/**
 * @internal
 */
var application_v31_constant = function (constant) {
    return constant.values
        .map(function (value) {
        var _a;
        return (0, application_plugin_1.application_plugin)({
            const: typeof value.value === "bigint"
                ? Number(value.value)
                : value.value,
            title: (0, application_title_1.application_title)(value),
            description: (0, application_description_1.application_description)(value),
        }, (_a = value.tags) !== null && _a !== void 0 ? _a : []);
    })
        .flat();
};
exports.application_v31_constant = application_v31_constant;
//# sourceMappingURL=application_v31_constant.js.map