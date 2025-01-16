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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataFactory = void 0;
var typescript_1 = __importDefault(require("typescript"));
var Metadata_1 = require("../schemas/metadata/Metadata");
var MetadataConstant_1 = require("../schemas/metadata/MetadataConstant");
var explore_metadata_1 = require("./internal/metadata/explore_metadata");
var iterate_metadata_collection_1 = require("./internal/metadata/iterate_metadata_collection");
var iterate_metadata_sort_1 = require("./internal/metadata/iterate_metadata_sort");
var ExpressionFactory_1 = require("./ExpressionFactory");
var MetadataFactory;
(function (MetadataFactory) {
    MetadataFactory.analyze = function (checker, context) {
        return function (options) {
            return function (collection) {
                return function (type) {
                    var errors = [];
                    var meta = (0, explore_metadata_1.explore_metadata)(checker)(options)(collection)(errors)(type, {
                        top: true,
                        object: null,
                        property: null,
                        parameter: null,
                        nested: null,
                        aliased: false,
                        escaped: false,
                        output: false,
                    });
                    (0, iterate_metadata_collection_1.iterate_metadata_collection)(errors)(collection);
                    (0, iterate_metadata_sort_1.iterate_metadata_sort)(collection)(meta);
                    if (options.validate)
                        errors.push.apply(errors, __spreadArray([], __read(MetadataFactory.validate(context)(options)(options.validate)(meta)), false));
                    return errors.length
                        ? {
                            success: false,
                            errors: errors,
                        }
                        : {
                            success: true,
                            data: meta,
                        };
                };
            };
        };
    };
    /**
     * @internal
     */
    MetadataFactory.soleLiteral = function (value) {
        var meta = Metadata_1.Metadata.initialize();
        meta.constants.push(MetadataConstant_1.MetadataConstant.from({
            values: [
                {
                    value: value,
                    tags: undefined,
                },
            ],
            type: "string",
        }));
        return meta;
    };
    MetadataFactory.validate = function (context) {
        return function (options) {
            return function (functor) {
                return function (meta) {
                    var visitor = {
                        functor: functor,
                        errors: [],
                        objects: new Set(),
                        arrays: new Set(),
                        tuples: new Set(),
                        aliases: new Set(),
                        functions: new Set(),
                    };
                    validateMeta(context)(options)(visitor)(meta, {
                        object: null,
                        property: null,
                        parameter: null,
                        nested: null,
                        top: true,
                        aliased: false,
                        escaped: false,
                        output: false,
                    });
                    return visitor.errors;
                };
            };
        };
    };
    var validateMeta = function (context) {
        return function (options) {
            return function (visitor) {
                return function (meta, explore) {
                    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g, e_8, _h, e_9, _j, e_10, _k;
                    var result = [];
                    if (context !== undefined)
                        try {
                            for (var _l = __values(meta.atomics), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var atomic = _m.value;
                                try {
                                    for (var _o = (e_2 = void 0, __values(atomic.tags)), _p = _o.next(); !_p.done; _p = _o.next()) {
                                        var row = _p.value;
                                        try {
                                            for (var _q = (e_3 = void 0, __values(row.filter(function (t) { return t.validate !== undefined && t.predicate === undefined; }))), _r = _q.next(); !_r.done; _r = _q.next()) {
                                                var tag = _r.value;
                                                try {
                                                    tag.predicate = ExpressionFactory_1.ExpressionFactory.transpile(context)(tag.validate);
                                                }
                                                catch (_s) {
                                                    result.push("Unable to transpile type tag script: ".concat(JSON.stringify(tag.validate)));
                                                    tag.predicate = function () { return typescript_1.default.factory.createTrue(); };
                                                }
                                            }
                                        }
                                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                        finally {
                                            try {
                                                if (_r && !_r.done && (_c = _q.return)) _c.call(_q);
                                            }
                                            finally { if (e_3) throw e_3.error; }
                                        }
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_p && !_p.done && (_b = _o.return)) _b.call(_o);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_a = _l.return)) _a.call(_l);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    result.push.apply(result, __spreadArray([], __read(visitor.functor(meta, explore)), false));
                    if (result.length)
                        visitor.errors.push({
                            name: meta.getName(),
                            explore: __assign({}, explore),
                            messages: __spreadArray([], __read(new Set(result)), false),
                        });
                    try {
                        for (var _t = __values(meta.aliases), _u = _t.next(); !_u.done; _u = _t.next()) {
                            var alias = _u.value;
                            validateAlias(context)(options)(visitor)(alias, explore);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_u && !_u.done && (_d = _t.return)) _d.call(_t);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    try {
                        for (var _v = __values(meta.arrays), _w = _v.next(); !_w.done; _w = _v.next()) {
                            var array = _w.value;
                            validateArray(context)(options)(visitor)(array.type, explore);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_w && !_w.done && (_e = _v.return)) _e.call(_v);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    try {
                        for (var _x = __values(meta.tuples), _y = _x.next(); !_y.done; _y = _x.next()) {
                            var tuple = _y.value;
                            validateTuple(context)(options)(visitor)(tuple.type, explore);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_y && !_y.done && (_f = _x.return)) _f.call(_x);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    try {
                        for (var _z = __values(meta.objects), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                            var obj = _0.value;
                            validateObject(context)(options)(visitor)(obj);
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_0 && !_0.done && (_g = _z.return)) _g.call(_z);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    try {
                        for (var _1 = __values(meta.functions), _2 = _1.next(); !_2.done; _2 = _1.next()) {
                            var func = _2.value;
                            validateFunction(context)(options)(visitor)(func, explore);
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (_2 && !_2.done && (_h = _1.return)) _h.call(_1);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                    try {
                        for (var _3 = __values(meta.sets), _4 = _3.next(); !_4.done; _4 = _3.next()) {
                            var set = _4.value;
                            validateMeta(context)(options)(visitor)(set, explore);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_4 && !_4.done && (_j = _3.return)) _j.call(_3);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    try {
                        for (var _5 = __values(meta.maps), _6 = _5.next(); !_6.done; _6 = _5.next()) {
                            var map = _6.value;
                            validateMeta(context)(options)(visitor)(map.key, explore);
                            validateMeta(context)(options)(visitor)(map.value, explore);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_6 && !_6.done && (_k = _5.return)) _k.call(_5);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    if (options.escape === true && meta.escaped !== null)
                        validateMeta(context)(options)(visitor)(meta.escaped.returns, __assign(__assign({}, explore), { escaped: true }));
                };
            };
        };
    };
    var validateAlias = function (context) {
        return function (options) {
            return function (visitor) {
                return function (alias, explore) {
                    if (visitor.aliases.has(alias))
                        return;
                    visitor.aliases.add(alias);
                    validateMeta(context)(options)(visitor)(alias.value, __assign(__assign({}, explore), { nested: alias, aliased: true }));
                };
            };
        };
    };
    var validateArray = function (context) {
        return function (options) {
            return function (visitor) {
                return function (array, explore) {
                    if (visitor.arrays.has(array))
                        return;
                    visitor.arrays.add(array);
                    validateMeta(context)(options)(visitor)(array.value, __assign(__assign({}, explore), { nested: array, top: false }));
                };
            };
        };
    };
    var validateTuple = function (context) {
        return function (options) {
            return function (visitor) {
                return function (tuple, explore) {
                    var e_11, _a;
                    if (visitor.tuples.has(tuple))
                        return;
                    visitor.tuples.add(tuple);
                    try {
                        for (var _b = __values(tuple.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var elem = _c.value;
                            validateMeta(context)(options)(visitor)(elem, __assign(__assign({}, explore), { nested: tuple, top: false }));
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                };
            };
        };
    };
    var validateObject = function (context) {
        return function (options) {
            return function (visitor) {
                return function (object) {
                    var e_12, _a;
                    if (visitor.objects.has(object))
                        return;
                    visitor.objects.add(object);
                    if (options.validate) {
                        var explore = {
                            object: object,
                            top: false,
                            property: null,
                            parameter: null,
                            nested: null,
                            aliased: false,
                            escaped: false,
                            output: false,
                        };
                        var errors = options.validate(Metadata_1.Metadata.create(__assign(__assign({}, Metadata_1.Metadata.initialize()), { objects: [object] })), explore);
                        if (errors.length)
                            visitor.errors.push({
                                name: object.name,
                                explore: explore,
                                messages: __spreadArray([], __read(new Set(errors)), false),
                            });
                    }
                    try {
                        for (var _b = __values(object.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var property = _c.value;
                            validateMeta(context)(options)(visitor)(property.value, {
                                object: object,
                                property: property.key.isSoleLiteral()
                                    ? property.key.getSoleLiteral()
                                    : {},
                                parameter: null,
                                nested: null,
                                top: false,
                                aliased: false,
                                escaped: false,
                                output: false,
                            });
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                };
            };
        };
    };
    var validateFunction = function (context) {
        return function (options) {
            return function (visitor) {
                return function (func, explore) {
                    var e_13, _a;
                    if (visitor.functions.has(func))
                        return;
                    visitor.functions.add(func);
                    try {
                        for (var _b = __values(func.parameters), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var param = _c.value;
                            validateMeta(context)(options)(visitor)(param.type, __assign(__assign({}, explore), { parameter: param.name, nested: null, top: false, output: false }));
                        }
                    }
                    catch (e_13_1) { e_13 = { error: e_13_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_13) throw e_13.error; }
                    }
                    if (func.output)
                        validateMeta(context)(options)(visitor)(func.output, __assign(__assign({}, explore), { parameter: null, nested: null, top: false, output: true }));
                };
            };
        };
    };
})(MetadataFactory || (exports.MetadataFactory = MetadataFactory = {}));
//# sourceMappingURL=MetadataFactory.js.map