"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_constant = void 0;
var typescript_1 = __importDefault(require("typescript"));
var MetadataConstant_1 = require("../../../schemas/metadata/MetadataConstant");
var MetadataConstantValue_1 = require("../../../schemas/metadata/MetadataConstantValue");
var ArrayUtil_1 = require("../../../utils/ArrayUtil");
var CommentFactory_1 = require("../../CommentFactory");
var iterate_metadata_constant = function (checker) {
    return function (options) {
        return function (meta, type) {
            if (!options.constant)
                return false;
            var filter = function (flag) { return (type.getFlags() & flag) !== 0; };
            var comment = function () {
                var _a, _b;
                if (!filter(typescript_1.default.TypeFlags.EnumLiteral))
                    return {};
                return {
                    jsDocTags: (_a = type.symbol) === null || _a === void 0 ? void 0 : _a.getJsDocTags(),
                    description: type.symbol
                        ? (_b = CommentFactory_1.CommentFactory.description(type.symbol)) !== null && _b !== void 0 ? _b : null
                        : undefined,
                };
            };
            if (type.isLiteral()) {
                var value_1 = typeof type.value === "object"
                    ? BigInt("".concat(type.value.negative ? "-" : "").concat(type.value.base10Value))
                    : type.value;
                var constant = ArrayUtil_1.ArrayUtil.take(meta.constants, function (elem) { return elem.type === typeof value_1; }, function () {
                    return MetadataConstant_1.MetadataConstant.create({
                        type: typeof value_1,
                        values: [],
                    });
                });
                ArrayUtil_1.ArrayUtil.add(constant.values, MetadataConstantValue_1.MetadataConstantValue.create(__assign({ value: value_1, tags: [] }, comment())), function (a, b) { return a.value === b.value; });
                return true;
            }
            else if (filter(typescript_1.default.TypeFlags.BooleanLiteral)) {
                comment();
                var value = checker.typeToString(type) === "true";
                var constant = ArrayUtil_1.ArrayUtil.take(meta.constants, function (elem) { return elem.type === "boolean"; }, function () {
                    return MetadataConstant_1.MetadataConstant.create({
                        type: "boolean",
                        values: [],
                    });
                });
                ArrayUtil_1.ArrayUtil.add(constant.values, MetadataConstantValue_1.MetadataConstantValue.create(__assign({ value: value, tags: [] }, comment())), function (a, b) { return a.value === b.value; });
                return true;
            }
            return false;
        };
    };
};
exports.iterate_metadata_constant = iterate_metadata_constant;
//# sourceMappingURL=iterate_metadata_constant.js.map