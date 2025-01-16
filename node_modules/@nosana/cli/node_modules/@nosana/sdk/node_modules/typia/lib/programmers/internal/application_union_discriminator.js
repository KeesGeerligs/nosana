"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.application_union_discriminator = void 0;
var UnionPredicator_1 = require("../helpers/UnionPredicator");
var application_union_discriminator = function (meta) {
    if (meta.size() === 0 ||
        meta.size() !== meta.objects.length ||
        meta.objects.some(function (o) { return o.isLiteral(); }) === true)
        return undefined;
    var specialized = UnionPredicator_1.UnionPredicator.object(meta.objects);
    var meet = specialized.length === meta.objects.length &&
        specialized.every(function (s) { return s.property.key.isSoleLiteral() && s.property.value.isSoleLiteral(); }) &&
        new Set(specialized.map(function (s) { return s.property.key.getSoleLiteral(); })).size === 1;
    if (meet === false)
        return undefined;
    return {
        propertyName: specialized[0].property.key.getSoleLiteral(),
        mapping: Object.fromEntries(specialized.map(function (s) { return [
            s.property.value.getSoleLiteral(),
            "#/components/schemas/".concat(s.object.name),
        ]; })),
    };
};
exports.application_union_discriminator = application_union_discriminator;
//# sourceMappingURL=application_union_discriminator.js.map