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
exports.iterate_metadata_array = void 0;
var MetadataArray_1 = require("../../../schemas/metadata/MetadataArray");
var ArrayUtil_1 = require("../../../utils/ArrayUtil");
var emplace_metadata_array_type_1 = require("./emplace_metadata_array_type");
var iterate_metadata_array = function (checker) {
    return function (options) {
        return function (collection) {
            return function (errors) {
                return function (meta, alias, explore) {
                    var array = checker.isArrayType(alias) === false
                        ? find_array_extended(checker)(new Map())(alias)
                        : alias;
                    if (array === null)
                        return false;
                    var arrayType = (0, emplace_metadata_array_type_1.emplace_metadata_array_type)(checker)(options)(collection)(errors)(alias, array, meta.nullable, explore);
                    ArrayUtil_1.ArrayUtil.add(meta.arrays, MetadataArray_1.MetadataArray.create({
                        type: arrayType,
                        tags: [],
                    }), function (elem) { return elem.type.name === arrayType.name; });
                    return true;
                };
            };
        };
    };
};
exports.iterate_metadata_array = iterate_metadata_array;
var find_array_extended = function (checker) {
    return function (memory) {
        return function (type) {
            var cached = memory.get(type);
            if (cached !== undefined)
                return null;
            memory.set(type, null);
            var res = (function () {
                var e_1, _a;
                var _b;
                if (type.isClassOrInterface() === false)
                    return null;
                try {
                    for (var _c = __values((_b = type.resolvedBaseTypes) !== null && _b !== void 0 ? _b : []), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var t = _d.value;
                        if (checker.isArrayType(t))
                            return t;
                        else {
                            var res_1 = find_array_extended(checker)(memory)(t);
                            if (res_1 !== null)
                                return res_1;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return null;
            })();
            memory.set(type, res);
            return res;
        };
    };
};
//# sourceMappingURL=iterate_metadata_array.js.map