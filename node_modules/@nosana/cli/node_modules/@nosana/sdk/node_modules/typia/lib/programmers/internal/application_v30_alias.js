"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v30_alias = void 0;
var CommentFactory_1 = require("../../factories/CommentFactory");
var application_description_1 = require("./application_description");
var application_v30_object_1 = require("./application_v30_object");
var application_v30_schema_1 = require("./application_v30_schema");
/**
 * @internal
 */
var application_v30_alias = function (blockNever) {
    return function (components) {
        return function (alias) {
            return function (nullable) {
                var _a, _b;
                if (alias.value.size() === 1 && alias.value.objects.length === 1)
                    return (0, application_v30_object_1.application_v30_object)(components)(alias.value.objects[0])(nullable);
                var key = "".concat(alias.name).concat(nullable ? ".Nullable" : "");
                var $ref = "#/components/schemas/".concat(key);
                if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[key]) === undefined) {
                    // TEMPORARY ASSIGNMENT
                    (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
                    components.schemas[key] = {};
                    // GENERATE SCHEMA
                    var schema = (0, application_v30_schema_1.application_v30_schema)(blockNever)(components)({
                        deprecated: alias.jsDocTags.some(function (tag) { return tag.name === "deprecated"; }) || undefined,
                        title: (function () {
                            var _a;
                            var info = alias.jsDocTags.find(function (tag) { return tag.name === "title"; });
                            return ((_a = info === null || info === void 0 ? void 0 : info.text) === null || _a === void 0 ? void 0 : _a.length)
                                ? CommentFactory_1.CommentFactory.merge(info.text)
                                : undefined;
                        })(),
                        description: (0, application_description_1.application_description)(alias),
                    })(alias.value);
                    if (schema !== null)
                        Object.assign(components.schemas[key], schema);
                }
                return { $ref: $ref };
            };
        };
    };
};
exports.application_v30_alias = application_v30_alias;
//# sourceMappingURL=application_v30_alias.js.map