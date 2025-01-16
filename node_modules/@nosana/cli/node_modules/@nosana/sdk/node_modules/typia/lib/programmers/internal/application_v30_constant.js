"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_v30_constant = void 0;
/**
 * @internal
 */
var application_v30_constant = function (constant) { return ({
    type: constant.type,
    enum: constant.values.map(function (v) { return v.value; }),
    // @todo default
}); };
exports.application_v30_constant = application_v30_constant;
//# sourceMappingURL=application_v30_constant.js.map