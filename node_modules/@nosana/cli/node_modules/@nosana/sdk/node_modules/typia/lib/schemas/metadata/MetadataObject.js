"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataObject = void 0;
var MetadataObject = /** @class */ (function () {
    /* -----------------------------------------------------------
          CONSTRUCTORS
      ----------------------------------------------------------- */
    /**
     * @hidden
     */
    function MetadataObject(props) {
        this.nullables = [];
        /**
         * @internal
         */
        this.tagged_ = false;
        this.name = props.name;
        this.properties = props.properties;
        this.description = props.description;
        this.jsDocTags = props.jsDocTags;
        this.index = props.index;
        this.validated = props.validated;
        this.recursive = props.recursive;
        this.nullables = props.nullables.slice();
        this.tagged_ = false;
    }
    /**
     * @internal
     */
    MetadataObject.create = function (props) {
        return new MetadataObject(props);
    };
    /**
     * @internal
     */
    MetadataObject._From_without_properties = function (obj) {
        return MetadataObject.create({
            name: obj.name,
            properties: [],
            description: obj.description,
            jsDocTags: obj.jsDocTags,
            index: obj.index,
            validated: false,
            recursive: obj.recursive,
            nullables: obj.nullables.slice(),
        });
    };
    MetadataObject.prototype.isPlain = function (level) {
        if (level === void 0) { level = 0; }
        return (this.recursive === false &&
            this.properties.length < 10 &&
            this.properties.every(function (property) {
                return property.key.isSoleLiteral() &&
                    property.value.size() === 1 &&
                    property.value.isRequired() === true &&
                    property.value.nullable === false &&
                    (property.value.atomics.length === 1 ||
                        (level < 1 &&
                            property.value.objects.length === 1 &&
                            property.value.objects[0].isPlain(level + 1)));
            }));
    };
    MetadataObject.prototype.isLiteral = function () {
        var _this = this;
        var _a;
        return ((_a = this.literal_) !== null && _a !== void 0 ? _a : (this.literal_ = (function () {
            if (_this.recursive === true)
                return false;
            return (_this.name === "__type" ||
                _this.name === "__object" ||
                _this.name.startsWith("__type.") ||
                _this.name.startsWith("__object.") ||
                _this.name.includes("readonly ["));
        })()));
    };
    MetadataObject.prototype.toJSON = function () {
        return {
            name: this.name,
            properties: this.properties.map(function (property) { return property.toJSON(); }),
            description: this.description,
            jsDocTags: this.jsDocTags,
            index: this.index,
            recursive: this.recursive,
            nullables: this.nullables.slice(),
        };
    };
    return MetadataObject;
}());
exports.MetadataObject = MetadataObject;
/**
 * @internal
 */
(function (MetadataObject) {
    MetadataObject.intersects = function (x, y) {
        return x.properties.some(function (prop) {
            return y.properties.find(function (oppo) { return prop.key.getName() === oppo.key.getName(); }) !== undefined;
        });
    };
    MetadataObject.covers = function (x, y) {
        return x.properties.length >= y.properties.length &&
            x.properties.every(function (prop) {
                return y.properties.find(function (oppo) { return prop.key.getName() === oppo.key.getName(); }) !== undefined;
            });
    };
})(MetadataObject || (exports.MetadataObject = MetadataObject = {}));
//# sourceMappingURL=MetadataObject.js.map