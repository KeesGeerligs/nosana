"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataTemplate = void 0;
var Metadata_1 = require("./Metadata");
var MetadataTemplate = /** @class */ (function () {
    function MetadataTemplate(props) {
        this.row = props.row.map(Metadata_1.Metadata.create);
        this.tags = props.tags;
    }
    MetadataTemplate.create = function (props) {
        return new MetadataTemplate(props);
    };
    MetadataTemplate.from = function (json, dict) {
        return new MetadataTemplate({
            row: json.row.map(function (m) { return Metadata_1.Metadata.from(m, dict); }),
            tags: json.tags,
        });
    };
    MetadataTemplate.prototype.getName = function () {
        var _a;
        return ((_a = this.name_) !== null && _a !== void 0 ? _a : (this.name_ = getName(this)));
    };
    /**
     * @internal
     */
    MetadataTemplate.prototype.getBaseName = function () {
        return ("`" +
            this.row
                .map(function (child) {
                return child.isConstant() && child.size() === 1
                    ? child.constants[0].values[0].value
                    : "${".concat(child.getName(), "}");
            })
                .join("")
                .split("`")
                .join("\\`") +
            "`");
    };
    MetadataTemplate.prototype.toJSON = function () {
        return {
            row: this.row.map(function (m) { return m.toJSON(); }),
            tags: this.tags,
        };
    };
    return MetadataTemplate;
}());
exports.MetadataTemplate = MetadataTemplate;
var getName = function (template) {
    var _a;
    var base = template.getBaseName();
    if (!((_a = template.tags) === null || _a === void 0 ? void 0 : _a.length))
        return base;
    else if (template.tags.length === 1) {
        var str = __spreadArray([base], __read(template.tags[0].map(function (t) { return t.name; })), false).join(" & ");
        return "(".concat(str, ")");
    }
    var rows = template.tags.map(function (row) {
        var str = row.map(function (t) { return t.name; }).join(" & ");
        return row.length === 1 ? str : "(".concat(str, ")");
    });
    return "(".concat(base, " & (").concat(rows.join(" | "), "))");
};
//# sourceMappingURL=MetadataTemplate.js.map