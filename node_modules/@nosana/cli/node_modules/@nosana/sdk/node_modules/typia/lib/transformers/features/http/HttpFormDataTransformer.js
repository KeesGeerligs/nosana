"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpFormDataTransformer = void 0;
var HttpFormDataProgrammer_1 = require("../../../programmers/http/HttpFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpFormDataTransformer;
(function (HttpFormDataTransformer) {
    HttpFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.scalar("http.formdata")(function (project) { return function (modulo) { return HttpFormDataProgrammer_1.HttpFormDataProgrammer.write(project)(modulo); }; });
})(HttpFormDataTransformer || (exports.HttpFormDataTransformer = HttpFormDataTransformer = {}));
//# sourceMappingURL=HttpFormDataTransformer.js.map