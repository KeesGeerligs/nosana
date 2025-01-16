"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_array = void 0;
var application_plugin_1 = require("./application_plugin");
/**
 * @internal
 */
var application_array = function (generator) {
    return function (components) {
        return function (array) {
            var _a, _b, _c;
            var _d;
            var factory = function () {
                return (0, application_plugin_1.application_plugin)({
                    type: "array",
                    items: generator(array.type.value),
                }, array.tags);
            };
            if (array.type.recursive === true) {
                var out = function () { return [{ $ref: $ref_1 }]; };
                var $ref_1 = "#/components/schemas/".concat(array.type.name);
                if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[$ref_1]) !== undefined)
                    return out();
                (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
                (_c = (_d = components.schemas)[$ref_1]) !== null && _c !== void 0 ? _c : (_d[$ref_1] = {});
                var oneOf = factory();
                Object.assign(components.schemas[$ref_1], oneOf.length === 1 ? oneOf[0] : { oneOf: oneOf });
                return out();
            }
            return factory();
        };
    };
};
exports.application_array = application_array;
//# sourceMappingURL=application_array.js.map