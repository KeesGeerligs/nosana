"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpIsFormDataTransformer = void 0;
var HttpIsFormDataProgrammer_1 = require("../../../programmers/http/HttpIsFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpIsFormDataTransformer;
(function (CreateHttpIsFormDataTransformer) {
    CreateHttpIsFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.factory("http.createIsFormData")(function (project) { return function (modulo) { return HttpIsFormDataProgrammer_1.HttpIsFormDataProgrammer.write(project)(modulo); }; });
})(CreateHttpIsFormDataTransformer || (exports.CreateHttpIsFormDataTransformer = CreateHttpIsFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpIsFormDataTransformer.js.map