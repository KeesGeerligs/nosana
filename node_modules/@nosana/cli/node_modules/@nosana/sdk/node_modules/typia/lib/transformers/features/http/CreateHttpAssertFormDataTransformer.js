"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHttpAssertFormDataTransformer = void 0;
var HttpAssertFormDataProgrammer_1 = require("../../../programmers/http/HttpAssertFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var CreateHttpAssertFormDataTransformer;
(function (CreateHttpAssertFormDataTransformer) {
    CreateHttpAssertFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.factory("http.createAssertFormData")(function (project) { return function (modulo) {
        return HttpAssertFormDataProgrammer_1.HttpAssertFormDataProgrammer.write(project)(modulo);
    }; });
})(CreateHttpAssertFormDataTransformer || (exports.CreateHttpAssertFormDataTransformer = CreateHttpAssertFormDataTransformer = {}));
//# sourceMappingURL=CreateHttpAssertFormDataTransformer.js.map