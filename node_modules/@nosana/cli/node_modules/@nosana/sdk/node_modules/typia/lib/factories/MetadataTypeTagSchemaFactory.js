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
exports.MetadataTypeTagSchemaFactory = void 0;
var MetadataTypeTagSchemaFactory;
(function (MetadataTypeTagSchemaFactory) {
    MetadataTypeTagSchemaFactory.object = function (report) {
        return function (obj) {
            var e_1, _a;
            if (obj.recursive) {
                report("".concat(obj.name, " has recursive type"));
                return undefined;
            }
            var output = {};
            try {
                for (var _b = __values(obj.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var p = _c.value;
                    var key = p.key.getSoleLiteral();
                    if (key === null) {
                        report("".concat(obj.name, " has non-literal key type: ").concat(p.key.getName()));
                        continue;
                    }
                    output[key] = iterate(report)({ object: obj, key: key })(p.value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return output;
        };
    };
    var iterate = function (report) {
        return function (parent) {
            return function (meta) {
                if (meta.any ||
                    meta.atomics.length ||
                    meta.arrays.length ||
                    meta.natives.length ||
                    meta.functions.length)
                    report("".concat(parent.object.name, ".").concat(parent.key, " has non-literal type"));
                else if (meta.size() > 1)
                    report("".concat(parent.object.name, ".").concat(parent.key, " has union type"));
                else if (meta.size() === 0)
                    if (meta.nullable)
                        return null;
                    else if (meta.isRequired() === true)
                        report("".concat(parent.object.name, ".").concat(parent.key, " has non-literal type"));
                    else
                        return undefined;
                else if (meta.constants.length)
                    return meta.constants[0].values[0].value;
                else if (meta.tuples.length) {
                    var tuple = meta.tuples[0];
                    if (tuple.type.isRest())
                        report("".concat(parent.object.name, ".").concat(parent.key, " has rest tuple type"));
                    else if (tuple.type.recursive)
                        report("".concat(parent.object.name, ".").concat(parent.key, " has recursive tuple type"));
                    else if (tuple.type.elements.some(function (e) { return e.required === false; }))
                        report("".concat(parent.object.name, ".").concat(parent.key, " has optional tuple type"));
                    return tuple.type.elements.map(iterate(report)(parent));
                }
                else if (meta.objects.length)
                    return MetadataTypeTagSchemaFactory.object(report)(meta.objects[0]);
                else
                    report("".concat(parent.object.name, ".").concat(parent.key, " has non-literal type"));
            };
        };
    };
})(MetadataTypeTagSchemaFactory || (exports.MetadataTypeTagSchemaFactory = MetadataTypeTagSchemaFactory = {}));
//# sourceMappingURL=MetadataTypeTagSchemaFactory.js.map