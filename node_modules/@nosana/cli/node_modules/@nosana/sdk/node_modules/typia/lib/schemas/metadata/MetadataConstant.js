"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataConstant = void 0;
var MetadataConstantValue_1 = require("./MetadataConstantValue");
var MetadataConstant = /** @class */ (function () {
    function MetadataConstant(props) {
        this.type = props.type;
        this.values = props.values.map(MetadataConstantValue_1.MetadataConstantValue.create);
    }
    MetadataConstant.create = function (props) {
        return new MetadataConstant(props);
    };
    MetadataConstant.from = function (json) {
        return MetadataConstant.create({
            type: json.type,
            values: json.values.map(MetadataConstantValue_1.MetadataConstantValue.from),
        });
    };
    MetadataConstant.prototype.toJSON = function () {
        return {
            type: this.type,
            values: this.values.map(function (value) { return value.toJSON(); }),
        };
    };
    return MetadataConstant;
}());
exports.MetadataConstant = MetadataConstant;
//# sourceMappingURL=MetadataConstant.js.map