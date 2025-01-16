"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpValidateFormDataTransformer = void 0;
var HttpValidateFormDataProgrammer_1 = require("../../../programmers/http/HttpValidateFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpValidateFormDataTransformer;
(function (CreateHttpValidateFormDataTransformer) {
    CreateHttpValidateFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.factory("http.createValidateFormData")(function (project) { return function (modulo) {
        return HttpValidateFormDataProgrammer_1.HttpValidateFormDataProgrammer.write(project)(modulo);
    }; });
})(CreateHttpValidateFormDataTransformer || (exports.CreateHttpValidateFormDataTransformer = CreateHttpValidateFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpValidateFormDataTransformer.js.map