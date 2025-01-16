"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmApplicationProgrammer = void 0;
var LlmSchemaProgrammer_1 = require("./LlmSchemaProgrammer");
var LlmApplicationProgrammer;
(function (LlmApplicationProgrammer) {
    LlmApplicationProgrammer.validate = function (meta, explore) {
        var e_1, _a;
        if (explore.top === false)
            return LlmSchemaProgrammer_1.LlmSchemaProgrammer.validate(meta);
        var output = [];
        var valid = meta.size() === 1 &&
            meta.objects.length === 1 &&
            meta.isRequired() === true &&
            meta.nullable === false;
        if (valid === false)
            output.push("LLM application's generic arugment must be a class/interface type.");
        var object = meta.objects[0];
        if (object !== undefined) {
            if (object.properties.some(function (p) { return p.key.isSoleLiteral() === false; }))
                output.push("LLM application does not allow dynamic keys.");
            var least = false;
            try {
                for (var _b = __values(object.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var p = _c.value;
                    var value = p.value;
                    if (value.functions.length) {
                        least || (least = true);
                        if (valid === false) {
                            if (value.functions.length !== 1 || value.size() !== 1)
                                output.push("LLM application's function type does not allow union type.");
                            if (value.isRequired() === false)
                                output.push("LLM application's function type must be required.");
                            if (value.nullable === true)
                                output.push("LLM application's function type must not be nullable.");
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (least === false)
                output.push("LLM application's target type must have at least a function type.");
        }
        return output;
    };
    LlmApplicationProgrammer.write = function (metadata) {
        var errors = LlmApplicationProgrammer.validate(metadata, {
            top: true,
            object: null,
            property: null,
            parameter: null,
            nested: null,
            aliased: false,
            escaped: false,
            output: false,
        });
        if (errors.length)
            throw new Error("Failed to write LLM application: " + errors.join("\n"));
        var object = metadata.objects[0];
        return {
            functions: object.properties
                .filter(function (p) {
                return p.value.functions.length === 1 &&
                    p.value.size() === 1 &&
                    p.key.isSoleLiteral();
            })
                .filter(function (p) { return p.jsDocTags.find(function (tag) { return tag.name === "hidden"; }) === undefined; })
                .map(function (p) {
                return writeFunction({
                    name: p.key.getSoleLiteral(),
                    function: p.value.functions[0],
                    description: p.description,
                    jsDocTags: p.jsDocTags,
                });
            }),
            options: {
                separate: null,
            },
        };
    };
    var writeFunction = function (props) {
        var _a, _b;
        var deprecated = props.jsDocTags.some(function (tag) { return tag.name === "deprecated"; });
        var tags = props.jsDocTags
            .map(function (tag) {
            var _a, _b;
            return tag.name === "tag"
                ? ((_b = (_a = tag.text) === null || _a === void 0 ? void 0 : _a.filter(function (elem) { return elem.kind === "text"; })) !== null && _b !== void 0 ? _b : [])
                : [];
        })
            .flat()
            .map(function (elem) { return elem.text; })
            .map(function (str) { var _a; return (_a = str.trim().split(" ")[0]) !== null && _a !== void 0 ? _a : ""; })
            .filter(function (str) { return !!str.length; });
        return {
            name: props.name,
            parameters: props.function.parameters.map(function (p) {
                var jsDocTagDescription = writeDescriptionFromJsDocTag({
                    jsDocTags: p.jsDocTags,
                    tag: "param",
                    parameter: p.name,
                });
                return writeSchema({
                    metadata: p.type,
                    description: jsDocTagDescription !== null && jsDocTagDescription !== void 0 ? jsDocTagDescription : p.description,
                    jsDocTags: jsDocTagDescription ? [] : p.jsDocTags,
                });
            }),
            output: props.function.output.size() || props.function.output.nullable
                ? writeSchema({
                    metadata: props.function.output,
                    description: (_a = writeDescriptionFromJsDocTag({
                        jsDocTags: props.jsDocTags,
                        tag: "return",
                    })) !== null && _a !== void 0 ? _a : writeDescriptionFromJsDocTag({
                        jsDocTags: props.jsDocTags,
                        tag: "returns",
                    }),
                    jsDocTags: [],
                })
                : undefined,
            description: (_b = props.description) !== null && _b !== void 0 ? _b : undefined,
            deprecated: deprecated || undefined,
            tags: tags.length ? tags : undefined,
        };
    };
    var writeSchema = function (props) {
        var _a, _b;
        var schema = LlmSchemaProgrammer_1.LlmSchemaProgrammer.write(props.metadata);
        var explicit = writeDescription({
            description: props.description,
            jsDocTags: props.jsDocTags,
        });
        return __assign(__assign({}, schema), (!!((_a = explicit.title) === null || _a === void 0 ? void 0 : _a.length) || !!((_b = explicit.description) === null || _b === void 0 ? void 0 : _b.length)
            ? explicit
            : {}));
    };
    var writeDescription = function (props) {
        var _a;
        var title = (function () {
            var _a;
            var _b = __read(getJsDocTexts({
                jsDocTags: props.jsDocTags,
                name: "title",
            }), 1), explicit = _b[0];
            if (explicit === null || explicit === void 0 ? void 0 : explicit.length)
                return explicit;
            else if (!((_a = props.description) === null || _a === void 0 ? void 0 : _a.length))
                return undefined;
            var index = props.description.indexOf("\n");
            var top = (index === -1 ? props.description : props.description.substring(0, index)).trim();
            return top.endsWith(".") ? top.substring(0, top.length - 1) : undefined;
        })();
        return {
            title: title,
            description: ((_a = props.description) === null || _a === void 0 ? void 0 : _a.length) ? props.description : undefined,
        };
    };
    var writeDescriptionFromJsDocTag = function (props) {
        var _a, _b;
        var parametric = props.parameter
            ? function (tag) {
                return tag.text.find(function (elem) {
                    return elem.kind === "parameterName" && elem.text === props.parameter;
                }) !== undefined;
            }
            : function () { return true; };
        var tag = props.jsDocTags.find(function (tag) { return tag.name === props.tag && tag.text && parametric(tag); });
        return tag && tag.text
            ? ((_b = (_a = tag.text.find(function (elem) { return elem.kind === "text"; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : null)
            : null;
    };
    var getJsDocTexts = function (props) {
        return props.jsDocTags
            .filter(function (tag) {
            return tag.name === props.name &&
                tag.text &&
                tag.text.find(function (elem) { return elem.kind === "text" && elem.text.length; }) !==
                    undefined;
        })
            .map(function (tag) { return tag.text.find(function (elem) { return elem.kind === "text"; }).text; });
    };
})(LlmApplicationProgrammer || (exports.LlmApplicationProgrammer = LlmApplicationProgrammer = {}));
//# sourceMappingURL=LlmApplicationProgrammer.js.map