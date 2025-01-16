"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpValidateFormDataTransformer = void 0;
var HttpValidateFormDataProgrammer_1 = require("../../../programmers/http/HttpValidateFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpValidateFormDataTransformer;
(function (HttpValidateFormDataTransformer) {
    HttpValidateFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.scalar("http.validateFormData")(function (project) { return function (modulo) {
        return HttpValidateFormDataProgrammer_1.HttpValidateFormDataProgrammer.write(project)(modulo);
    }; });
})(HttpValidateFormDataTransformer || (exports.HttpValidateFormDataTransformer = HttpValidateFormDataTransformer = {}));
//# sourceMappingURL=HttpValidateFormDataTransformer.js.map