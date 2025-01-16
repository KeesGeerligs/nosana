"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAssertFormDataTransformer = void 0;
var HttpAssertFormDataProgrammer_1 = require("../../../programmers/http/HttpAssertFormDataProgrammer");
var GenericTransformer_1 = require("../../internal/GenericTransformer");
var HttpAssertFormDataTransformer;
(function (HttpAssertFormDataTransformer) {
    HttpAssertFormDataTransformer.transform = GenericTransformer_1.GenericTransformer.scalar("http.assertFormData")(function (project) { return function (modulo) {
        return HttpAssertFormDataProgrammer_1.HttpAssertFormDataProgrammer.write(project)(modulo);
    }; });
})(HttpAssertFormDataTransformer || (exports.HttpAssertFormDataTransformer = HttpAssertFormDataTransformer = {}));
//# sourceMappingURL=HttpAssertFormDataTransformer.js.map