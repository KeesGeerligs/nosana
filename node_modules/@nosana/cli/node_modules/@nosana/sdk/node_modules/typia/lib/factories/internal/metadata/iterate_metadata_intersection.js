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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_intersection = void 0;
var typescript_1 = __importDefault(require("typescript"));
var MetadataAtomic_1 = require("../../../schemas/metadata/MetadataAtomic");
var MetadataConstant_1 = require("../../../schemas/metadata/MetadataConstant");
var MetadataConstantValue_1 = require("../../../schemas/metadata/MetadataConstantValue");
var MetadataTemplate_1 = require("../../../schemas/metadata/MetadataTemplate");
var ArrayUtil_1 = require("../../../utils/ArrayUtil");
var MetadataTypeTagFactory_1 = require("../../MetadataTypeTagFactory");
var explore_metadata_1 = require("./explore_metadata");
var iterate_metadata_1 = require("./iterate_metadata");
var iterate_metadata_array_1 = require("./iterate_metadata_array");
var iterate_metadata_intersection = function (checker) {
    return function (options) {
        return function (collection) {
            return function (errors) {
                return function (meta, type, explore) {
                    var _a, _b;
                    if (!type.isIntersection())
                        return false;
                    if (
                    // ONLY OBJECT TYPED INTERSECTION
                    type.types.every(function (child) {
                        return (child.getFlags() & typescript_1.default.TypeFlags.Object) !== 0 &&
                            !checker.isArrayType(child) &&
                            !checker.isTupleType(child);
                    }))
                        return false;
                    // COSTRUCT FAKE METADATA LIST
                    var fakeCollection = collection.clone();
                    var fakeErrors = [];
                    var children = __spreadArray([], __read(new Map(type.types.map(function (t) {
                        var m = (0, explore_metadata_1.explore_metadata)(checker)(__assign(__assign({}, options), { absorb: true }))(fakeCollection)(fakeErrors)(t, __assign(__assign({}, explore), { aliased: false }));
                        return [m.getName(), m];
                    })).values()), false);
                    if (fakeErrors.length) {
                        errors.push.apply(errors, __spreadArray([], __read(fakeErrors), false));
                        return true;
                    }
                    // ONLY ONE CHILD AFTER REMOVING DUPLICATES
                    if (children.length === 1) {
                        (0, iterate_metadata_1.iterate_metadata)(checker)(options)(collection)(errors)(meta, type.types[0], explore);
                        return true;
                    }
                    else if (children.every(function (c) { return c.objects.length === c.size(); }))
                        // ONLY OBJECT TYPED INTERSECTION (DETAILED)
                        return false;
                    // VALIDATE EACH TYPES
                    var nonsensible = function () {
                        errors.push({
                            name: children.map(function (c) { return c.getName(); }).join(" & "),
                            explore: __assign({}, explore),
                            messages: ["nonsensible intersection"],
                        });
                        return true;
                    };
                    var individuals = children
                        .map(function (child, i) { return [child, i]; })
                        .filter(function (_a) {
                        var _b = __read(_a, 1), c = _b[0];
                        return (c.size() === 1 &&
                            (c.atomics.length === 1 ||
                                (c.constants.length === 1 &&
                                    c.constants[0].values.length === 1) ||
                                c.arrays.length === 1)) ||
                            c.templates.length === 1;
                    });
                    if (individuals.length !== 1)
                        return nonsensible();
                    var objects = children.filter(function (c) {
                        return c.nullable === false &&
                            c.isRequired() === true &&
                            c.objects.length &&
                            c.objects.length === c.size() &&
                            c.objects.every(function (o) { return o.properties.every(function (p) { return p.value.optional; }); });
                    });
                    var arrays = new Set(individuals.map(function (_a) {
                        var _b = __read(_a, 1), c = _b[0];
                        return c.arrays.map(function (a) { return a.type.name; });
                    }).flat());
                    var atomics = new Set(individuals.map(function (_a) {
                        var _b = __read(_a, 1), c = _b[0];
                        return __spreadArray([], __read(c.atomics.map(function (a) { return a.type; })), false);
                    }).flat());
                    var constants = individuals
                        .filter(function (i) { return i[0].constants.length === 1; })
                        .map(function (_a) {
                        var _b = __read(_a, 1), m = _b[0];
                        return m;
                    });
                    var templates = individuals
                        .filter(function (i) { return i[0].templates.length === 1; })
                        .map(function (_a) {
                        var _b = __read(_a, 1), m = _b[0];
                        return m;
                    });
                    // ESCAPE WHEN ONLY CONSTANT TYPES EXIST
                    if (atomics.size + constants.length + arrays.size + templates.length > 1 ||
                        individuals.length + objects.length !== children.length)
                        return nonsensible();
                    // RE-GENERATE TYPE
                    var target = arrays.size
                        ? "array"
                        : atomics.size
                            ? atomics.values().next().value
                            : constants.length
                                ? constants[0].constants[0].type
                                : "string";
                    if (target === "array") {
                        var name_1 = arrays.values().next().value;
                        if (!meta.arrays.some(function (a) { return a.type.name === name_1; })) {
                            (0, iterate_metadata_array_1.iterate_metadata_array)(checker)(options)(collection)(errors)(meta, type.types[individuals.find(function (i) { return i[0].arrays.length === 1; })[1]], __assign(__assign({}, explore), { aliased: false, escaped: false }));
                        }
                    }
                    else if (atomics.size)
                        ArrayUtil_1.ArrayUtil.add(meta.atomics, MetadataAtomic_1.MetadataAtomic.create({
                            type: atomics.values().next().value,
                            tags: [],
                        }), function (a, b) { return a.type === b.type; });
                    else if (constants.length)
                        ArrayUtil_1.ArrayUtil.take(ArrayUtil_1.ArrayUtil.take(meta.constants, function (o) { return o.type === target; }, function () {
                            return MetadataConstant_1.MetadataConstant.create({
                                type: target,
                                values: [],
                            });
                        }).values, function (o) { return o.value === constants[0].constants[0].values[0].value; }, function () {
                            return MetadataConstantValue_1.MetadataConstantValue.create({
                                value: constants[0].constants[0].values[0].value,
                                tags: [],
                            });
                        });
                    else if (templates.length)
                        ArrayUtil_1.ArrayUtil.take(meta.templates, function (o) { return o.getBaseName() === templates[0].templates[0].getBaseName(); }, function () {
                            return MetadataTemplate_1.MetadataTemplate.create({
                                row: templates[0].templates[0].row,
                                tags: [],
                            });
                        });
                    // ASSIGN TAGS
                    if (objects.length) {
                        var tags = MetadataTypeTagFactory_1.MetadataTypeTagFactory.analyze(errors)(target)(objects.map(function (om) { return om.objects; }).flat(), explore);
                        if (tags.length)
                            if (target === "array")
                                meta.arrays.at(-1).tags.push(tags);
                            else if (atomics.size)
                                meta.atomics.find(function (a) { return a.type === target; }).tags.push(tags);
                            else if (constants.length) {
                                var constant = meta.constants.find(function (c) { return c.type === target; });
                                var value = constant.values.find(function (v) { return v.value === constants[0].constants[0].values[0].value; });
                                (_a = value.tags) !== null && _a !== void 0 ? _a : (value.tags = []);
                                value.tags.push(tags);
                            }
                            else if (templates.length) {
                                var template = meta.templates.find(function (t) {
                                    return t.getBaseName() === templates[0].templates[0].getBaseName();
                                });
                                (_b = template.tags) !== null && _b !== void 0 ? _b : (template.tags = []);
                                template.tags.push(tags);
                            }
                    }
                    return true;
                };
            };
        };
    };
};
exports.iterate_metadata_intersection = iterate_metadata_intersection;
//# sourceMappingURL=iterate_metadata_intersection.js.map