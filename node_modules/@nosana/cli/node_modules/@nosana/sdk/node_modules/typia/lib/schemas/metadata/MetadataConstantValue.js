"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataConstantValue = void 0;
var MetadataConstantValue = /** @class */ (function () {
    function MetadataConstantValue(props) {
        this.value = props.value;
        this.tags = props.tags;
        this.description = props.description;
        this.jsDocTags = props.jsDocTags;
    }
    MetadataConstantValue.create = function (props) {
        return new MetadataConstantValue(props);
    };
    MetadataConstantValue.from = function (json) {
        return MetadataConstantValue.create({
            value: typeof json.value === "bigint" ? BigInt(json.value) : json.value,
            tags: json.tags,
            description: json.description,
            jsDocTags: json.jsDocTags,
        });
    };
    MetadataConstantValue.prototype.getName = function () {
        var _a;
        return ((_a = this.name_) !== null && _a !== void 0 ? _a : (this.name_ = getName(this)));
    };
    MetadataConstantValue.prototype.toJSON = function () {
        return {
            value: typeof this.value === "bigint" ? this.value.toString() : this.value,
            tags: this.tags,
            description: this.description,
            jsDocTags: this.jsDocTags,
        };
    };
    return MetadataConstantValue;
}());
exports.MetadataConstantValue = MetadataConstantValue;
var getName = function (obj) {
    var _a;
    var base = typeof obj.value === "string"
        ? JSON.stringify(obj.value)
        : obj.value.toString();
    if (!((_a = obj.tags) === null || _a === void 0 ? void 0 : _a.length))
        return base;
    var rows = obj.tags.map(function (row) {
        var str = row.map(function (t) { return t.name; }).join(" & ");
        return row.length === 1 ? str : "(".concat(str, ")");
    });
    return "(".concat(base, " & (").concat(rows.join(" | "), "))");
};
//# sourceMappingURL=MetadataConstantValue.js.map