"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_title = void 0;
var CommentFactory_1 = require("../../factories/CommentFactory");
var application_title = function (schema) {
    var _a, _b, _c;
    var info = (_a = schema.jsDocTags) === null || _a === void 0 ? void 0 : _a.find(function (tag) { return tag.name === "title"; });
    if ((_b = info === null || info === void 0 ? void 0 : info.text) === null || _b === void 0 ? void 0 : _b.length)
        return CommentFactory_1.CommentFactory.merge(info.text);
    else if (!((_c = schema.description) === null || _c === void 0 ? void 0 : _c.length))
        return undefined;
    var index = schema.description.indexOf("\n");
    var top = (index === -1 ? schema.description : schema.description.substring(0, index)).trim();
    return top.endsWith(".") ? top.substring(0, top.length - 1) : undefined;
};
exports.application_title = application_title;
//# sourceMappingURL=application_title.js.map