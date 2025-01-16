"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpIsFormDataTransformer = void 0;
var HttpIsFormDataProgrammer_1 = require("../../../programmers/http/HttpIsFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpIsFormDataTransformer;
(function (HttpIsFormDataTransformer) {
    HttpIsFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.scalar("http.isFormData")(function (project) { return function (modulo) { return HttpIsFormDataProgrammer_1.HttpIsFormDataProgrammer.write(project)(modulo); }; });
})(HttpIsFormDataTransformer || (exports.HttpIsFormDataTransformer = HttpIsFormDataTransformer = {}));
//# sourceMappingURL=HttpIsFormDataTransformer.js.map