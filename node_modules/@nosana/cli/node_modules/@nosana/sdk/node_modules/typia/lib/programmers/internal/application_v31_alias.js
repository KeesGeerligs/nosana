"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v31_alias = void 0;
var application_description_1 = require("./application_description");
var application_title_1 = require("./application_title");
var application_v31_object_1 = require("./application_v31_object");
var application_v31_schema_1 = require("./application_v31_schema");
/**
 * @internal
 */
var application_v31_alias = function (blockNever) {
    return function (components) {
        return function (alias) {
            var _a, _b;
            if (alias.value.size() === 1 && alias.value.objects.length === 1)
                return (0, application_v31_object_1.application_v31_object)(components)(alias.value.objects[0]);
            var $ref = "#/components/schemas/".concat(alias.name);
            if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[alias.name]) === undefined) {
                // TEMPORARY ASSIGNMENT
                (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
                components.schemas[alias.name] = {};
                // GENERATE SCHEMA
                var schema = (0, application_v31_schema_1.application_v31_schema)(blockNever)(components)({
                    deprecated: alias.jsDocTags.some(function (tag) { return tag.name === "deprecated"; }) || undefined,
                    title: (0, application_title_1.application_title)(alias),
                    description: (0, application_description_1.application_description)(alias),
                })(alias.value);
                if (schema !== null)
                    Object.assign(components.schemas[alias.name], schema);
            }
            return { $ref: $ref };
        };
    };
};
exports.application_v31_alias = application_v31_alias;
//# sourceMappingURL=application_v31_alias.js.map