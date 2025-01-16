"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpFormDataTransformer = void 0;
var HttpFormDataProgrammer_1 = require("../../../programmers/http/HttpFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpFormDataTransformer;
(function (CreateHttpFormDataTransformer) {
    CreateHttpFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.factory("http.createFormData")(function (project) { return function (modulo) { return HttpFormDataProgrammer_1.HttpFormDataProgrammer.write(project)(modulo); }; });
})(CreateHttpFormDataTransformer || (exports.CreateHttpFormDataTransformer = CreateHttpFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpFormDataTransformer.js.map