"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataParameter = void 0;
var Metadata_1 = require("./Metadata");
var MetadataParameter = /** @class */ (function () {
    function MetadataParameter(props) {
        this.name = props.name;
        this.type = props.type;
        this.description = props.description;
        this.jsDocTags = props.jsDocTags;
    }
    /**
     * @internal
     */
    MetadataParameter.create = function (props) {
        return new MetadataParameter(props);
    };
    MetadataParameter.from = function (json, dict) {
        return MetadataParameter.create({
            name: json.name,
            type: Metadata_1.Metadata.from(json.type, dict),
            description: json.description,
            jsDocTags: json.jsDocTags,
        });
    };
    MetadataParameter.prototype.toJSON = function () {
        return {
            name: this.name,
            type: this.type.toJSON(),
            description: this.description,
            jsDocTags: this.jsDocTags,
        };
    };
    return MetadataParameter;
}());
exports.MetadataParameter = MetadataParameter;
//# sourceMappingURL=MetadataParameter.js.map