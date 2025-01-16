"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_description = void 0;
var application_description = function (props) {
    var _a, _b, _c, _d, _e, _f, _g;
    return (_g = (_f = (_e = (_d = (_c = (_b = (_a = props.jsDocTags) === null || _a === void 0 ? void 0 : _a.find(function (tag) { return tag.name === "description"; })) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) === null || _e === void 0 ? void 0 : _e.split("\r\n").join("\n")) !== null && _f !== void 0 ? _f : props.description) !== null && _g !== void 0 ? _g : undefined;
};
exports.application_description = application_description;
//# sourceMappingURL=application_description.js.map