"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v30_object = void 0;
var CommentFactory_1 = require("../../factories/CommentFactory");
var Metadata_1 = require("../../schemas/metadata/Metadata");
var PatternUtil_1 = require("../../utils/PatternUtil");
var application_description_1 = require("./application_description");
var application_v30_schema_1 = require("./application_v30_schema");
var metadata_to_pattern_1 = require("./metadata_to_pattern");
/**
 * @internal
 */
var application_v30_object = function (components) {
    return function (obj) {
        return function (nullable) {
            var _a, _b;
            if (obj.isLiteral() === true)
                return create_object_schema(components)(obj)(nullable);
            var key = "".concat(obj.name).concat(nullable ? ".Nullable" : "");
            var $ref = "#/components/schemas/".concat(key);
            if (((_a = components.schemas) === null || _a === void 0 ? void 0 : _a[key]) !== undefined)
                return { $ref: $ref };
            var object = {};
            (_b = components.schemas) !== null && _b !== void 0 ? _b : (components.schemas = {});
            components.schemas[key] = object;
            Object.assign(object, create_object_schema(components)(obj)(nullable));
            return { $ref: $ref };
        };
    };
};
exports.application_v30_object = application_v30_object;
/**
 * @internal
 */
var create_object_schema = function (components) {
    return function (obj) {
        return function (nullable) {
            var e_1, _a;
            // ITERATE PROPERTIES
            var properties = {};
            var extraMeta = {
                patternProperties: {},
                additionalProperties: undefined,
            };
            var required = [];
            var _loop_1 = function (property) {
                if (
                // FUNCTIONAL TYPE
                property.value.functions.length &&
                    property.value.nullable === false &&
                    property.value.isRequired() === true &&
                    property.value.size() === 0)
                    return "continue";
                else if (property.jsDocTags.find(function (tag) { return tag.name === "hidden"; }))
                    return "continue"; // THE HIDDEN TAG
                var key = property.key.getSoleLiteral();
                var schema = (0, application_v30_schema_1.application_v30_schema)(true)(components)({
                    deprecated: property.jsDocTags.some(function (tag) { return tag.name === "deprecated"; }) ||
                        undefined,
                    title: (function () {
                        var _a, _b;
                        var info = property.jsDocTags.find(function (tag) { return tag.name === "title"; });
                        if ((_a = info === null || info === void 0 ? void 0 : info.text) === null || _a === void 0 ? void 0 : _a.length)
                            return CommentFactory_1.CommentFactory.merge(info.text);
                        else if (!((_b = property.description) === null || _b === void 0 ? void 0 : _b.length))
                            return undefined;
                        var index = property.description.indexOf("\n");
                        var top = (index === -1
                            ? property.description
                            : property.description.substring(0, index)).trim();
                        return top.endsWith(".")
                            ? top.substring(0, top.length - 1)
                            : undefined;
                    })(),
                    description: (0, application_description_1.application_description)(property),
                })(property.value);
                if (schema === null)
                    return "continue";
                if (key !== null) {
                    properties[key] = schema;
                    if (property.value.isRequired() === true)
                        required.push(key);
                }
                else {
                    var pattern = (0, metadata_to_pattern_1.metadata_to_pattern)(true)(property.key);
                    if (pattern === PatternUtil_1.PatternUtil.STRING)
                        extraMeta.additionalProperties = [property.value, schema];
                    else
                        extraMeta.patternProperties[pattern] = [property.value, schema];
                }
            };
            try {
                for (var _b = __values(obj.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var property = _c.value;
                    _loop_1(property);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return {
                type: "object",
                properties: properties,
                nullable: nullable,
                required: required.length ? required : undefined,
                title: (function () {
                    var _a;
                    var info = obj.jsDocTags.find(function (tag) { return tag.name === "title"; });
                    return ((_a = info === null || info === void 0 ? void 0 : info.text) === null || _a === void 0 ? void 0 : _a.length) ? CommentFactory_1.CommentFactory.merge(info.text) : undefined;
                })(),
                description: (0, application_description_1.application_description)(obj),
                additionalProperties: join(components)(extraMeta),
            };
        };
    };
};
/**
 * @internal
 */
var join = function (components) {
    return function (extra) {
        var _a;
        // LIST UP METADATA
        var elements = Object.values(extra.patternProperties || {});
        if (extra.additionalProperties)
            elements.push(extra.additionalProperties);
        // SHORT RETURN
        if (elements.length === 0)
            return undefined;
        else if (elements.length === 1)
            return elements[0][1];
        // MERGE METADATA AND GENERATE VULNERABLE SCHEMA
        var meta = elements
            .map(function (tuple) { return tuple[0]; })
            .reduce(function (x, y) { return Metadata_1.Metadata.merge(x, y); });
        return (_a = (0, application_v30_schema_1.application_v30_schema)(true)(components)({})(meta)) !== null && _a !== void 0 ? _a : undefined;
    };
};
//# sourceMappingURL=application_v30_object.js.map