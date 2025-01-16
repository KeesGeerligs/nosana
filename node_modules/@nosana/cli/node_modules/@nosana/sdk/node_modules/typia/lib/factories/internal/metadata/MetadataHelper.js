"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataHelper = void 0;
var Metadata_1 = require("../../../schemas/metadata/Metadata");
var MetadataConstant_1 = require("../../../schemas/metadata/MetadataConstant");
var MetadataConstantValue_1 = require("../../../schemas/metadata/MetadataConstantValue");
var MetadataHelper;
(function (MetadataHelper) {
    MetadataHelper.literal_to_metadata = function (key) {
        var metadata = Metadata_1.Metadata.initialize();
        metadata.constants.push(MetadataConstant_1.MetadataConstant.create({
            type: "string",
            values: [
                MetadataConstantValue_1.MetadataConstantValue.create({
                    value: key,
                    tags: undefined,
                }),
            ],
        }));
        return metadata;
    };
})(MetadataHelper || (exports.MetadataHelper = MetadataHelper = {}));
//# sourceMappingURL=MetadataHelper.js.map