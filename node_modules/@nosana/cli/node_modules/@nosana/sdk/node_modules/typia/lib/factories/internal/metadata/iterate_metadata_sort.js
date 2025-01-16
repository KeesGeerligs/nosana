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
exports.iterate_metadata_sort = void 0;
var Metadata_1 = require("../../../schemas/metadata/Metadata");
var MetadataObject_1 = require("../../../schemas/metadata/MetadataObject");
var iterate_metadata_sort = function (collection) { return function (meta) {
    var e_1, _a, e_2, _c, e_3, _d, e_4, _e, e_5, _f;
    var visited = new Set();
    try {
        for (var _g = __values(collection.arrays()), _h = _g.next(); !_h.done; _h = _g.next()) {
            var array = _h.value;
            iterate(visited)(collection)(array.value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_h && !_h.done && (_a = _g.return)) _a.call(_g);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var _j = __values(collection.tuples()), _k = _j.next(); !_k.done; _k = _j.next()) {
            var tuple = _k.value;
            try {
                for (var _l = (e_3 = void 0, __values(tuple.elements)), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var element = _m.value;
                    iterate(visited)(collection)(element);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        for (var _o = __values(collection.objects()), _p = _o.next(); !_p.done; _p = _o.next()) {
            var object = _p.value;
            try {
                for (var _q = (e_5 = void 0, __values(object.properties)), _r = _q.next(); !_r.done; _r = _q.next()) {
                    var property = _r.value;
                    iterate(visited)(collection)(property.value);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_r && !_r.done && (_f = _q.return)) _f.call(_q);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_p && !_p.done && (_e = _o.return)) _e.call(_o);
        }
        finally { if (e_4) throw e_4.error; }
    }
    iterate(visited)(collection)(meta);
}; };
exports.iterate_metadata_sort = iterate_metadata_sort;
var iterate = function (visited) {
    return function (collection) {
        return function (meta) {
            var e_6, _a, e_7, _c, e_8, _d;
            if (visited.has(meta))
                return;
            visited.add(meta);
            try {
                // ITERATE CHILDREN
                for (var _e = __values(meta.maps), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var map = _f.value;
                    iterate(visited)(collection)(map.value);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (var _g = __values(meta.sets), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var set = _h.value;
                    iterate(visited)(collection)(set);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                }
                finally { if (e_7) throw e_7.error; }
            }
            if (meta.escaped !== null)
                iterate(visited)(collection)(meta.escaped.returns);
            if (meta.rest !== null)
                iterate(visited)(collection)(meta.rest);
            // SORT OBJECTS
            if (meta.objects.length > 1) {
                meta.objects.sort(function (x, y) {
                    return MetadataObject_1.MetadataObject.covers(x, y) ? -1 : MetadataObject_1.MetadataObject.covers(y, x) ? 1 : 0;
                });
                meta.union_index = collection.getUnionIndex(meta);
            }
            // SORT ARRAYS AND TUPLES
            if (meta.arrays.length > 1)
                meta.arrays.sort(function (x, y) {
                    return Metadata_1.Metadata.covers(x.type.value, y.type.value)
                        ? -1
                        : Metadata_1.Metadata.covers(y.type.value, x.type.value)
                            ? 1
                            : 0;
                });
            if (meta.tuples.length > 1)
                meta.tuples.sort(function (x, y) {
                    var xt = Metadata_1.Metadata.initialize();
                    var yt = Metadata_1.Metadata.initialize();
                    xt.tuples.push(x);
                    yt.tuples.push(y);
                    return Metadata_1.Metadata.covers(xt, yt) ? -1 : Metadata_1.Metadata.covers(yt, xt) ? 1 : 0;
                });
            try {
                // SORT CONSTANT VALUES
                for (var _j = __values(meta.constants), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var constant = _k.value;
                    if (constant.type === "string")
                        constant.values.sort();
                    else if (constant.type === "number")
                        constant.values.sort(function (a, b) { return a.value - b.value; });
                    else if (constant.type === "bigint")
                        constant.values.sort(function (a, b) {
                            return a.value < b.value ? -1 : 1;
                        });
                    else
                        constant.values.sort(function (a, _b) { return (a.value === false ? -1 : 1); });
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                }
                finally { if (e_8) throw e_8.error; }
            }
        };
    };
};
//# sourceMappingURL=iterate_metadata_sort.js.map