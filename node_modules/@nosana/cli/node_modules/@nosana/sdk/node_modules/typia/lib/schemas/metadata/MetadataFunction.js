"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataFunction = void 0;
var Metadata_1 = require("./Metadata");
var MetadataParameter_1 = require("./MetadataParameter");
var MetadataFunction = /** @class */ (function () {
    /**
     * @hidden
     */
    function MetadataFunction(props) {
        this.parameters = props.parameters;
        this.output = props.output;
        this.async = props.async;
    }
    /**
     * @internal
     */
    MetadataFunction.create = function (props) {
        return new MetadataFunction(props);
    };
    MetadataFunction.from = function (json, dict) {
        return MetadataFunction.create({
            parameters: json.parameters.map(function (p) { return MetadataParameter_1.MetadataParameter.from(p, dict); }),
            output: Metadata_1.Metadata.from(json.output, dict),
            async: json.async,
        });
    };
    MetadataFunction.prototype.toJSON = function () {
        return {
            parameters: this.parameters.map(function (p) { return p.toJSON(); }),
            output: this.output.toJSON(),
            async: this.async,
        };
    };
    return MetadataFunction;
}());
exports.MetadataFunction = MetadataFunction;
//# sourceMappingURL=MetadataFunction.js.map