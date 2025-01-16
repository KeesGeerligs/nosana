"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExpressionTransformer = void 0;
var path_1 = __importDefault(require("path"));
var FunctionalAssertFunctionProgrammer_1 = require("../programmers/functional/FunctionalAssertFunctionProgrammer");
var FunctionalAssertParametersProgrammer_1 = require("../programmers/functional/FunctionalAssertParametersProgrammer");
var FunctionalAssertReturnProgrammer_1 = require("../programmers/functional/FunctionalAssertReturnProgrammer");
var FunctionalIsFunctionProgrammer_1 = require("../programmers/functional/FunctionalIsFunctionProgrammer");
var FunctionalIsParametersProgrammer_1 = require("../programmers/functional/FunctionalIsParametersProgrammer");
var FunctionalIsReturnProgrammer_1 = require("../programmers/functional/FunctionalIsReturnProgrammer");
var FunctionalValidateFunctionProgrammer_1 = require("../programmers/functional/FunctionalValidateFunctionProgrammer");
var FunctionalValidateParametersProgrammer_1 = require("../programmers/functional/FunctionalValidateParametersProgrammer");
var FunctionalValidateReturnProgrammer_1 = require("../programmers/functional/FunctionalValidateReturnProgrammer");
var FunctionalGenericTransformer_1 = require("./features/functional/FunctionalGenericTransformer");
var NamingConvention_1 = require("../utils/NamingConvention");
var AssertTransformer_1 = require("./features/AssertTransformer");
var CreateAssertTransformer_1 = require("./features/CreateAssertTransformer");
var CreateIsTransformer_1 = require("./features/CreateIsTransformer");
var CreateRandomTransformer_1 = require("./features/CreateRandomTransformer");
var CreateValidateTransformer_1 = require("./features/CreateValidateTransformer");
var IsTransformer_1 = require("./features/IsTransformer");
var RandomTransformer_1 = require("./features/RandomTransformer");
var ValidateTransformer_1 = require("./features/ValidateTransformer");
var CreateHttpAssertFormDataTransformer_1 = require("./features/http/CreateHttpAssertFormDataTransformer");
var CreateHttpAssertHeadersTransformer_1 = require("./features/http/CreateHttpAssertHeadersTransformer");
var CreateHttpAssertQueryTransformer_1 = require("./features/http/CreateHttpAssertQueryTransformer");
var CreateHttpFormDataTransformer_1 = require("./features/http/CreateHttpFormDataTransformer");
var CreateHttpHeadersTransformer_1 = require("./features/http/CreateHttpHeadersTransformer");
var CreateHttpIsFormDataTransformer_1 = require("./features/http/CreateHttpIsFormDataTransformer");
var CreateHttpIsHeadersTransformer_1 = require("./features/http/CreateHttpIsHeadersTransformer");
var CreateHttpIsQueryTransformer_1 = require("./features/http/CreateHttpIsQueryTransformer");
var CreateHttpParameterTransformer_1 = require("./features/http/CreateHttpParameterTransformer");
var CreateHttpQueryTransformer_1 = require("./features/http/CreateHttpQueryTransformer");
var CreateHttpValidateFormDataTransformer_1 = require("./features/http/CreateHttpValidateFormDataTransformer");
var CreateHttpValidateHeadersTransformer_1 = require("./features/http/CreateHttpValidateHeadersTransformer");
var CreateHttpValidateQueryTransformer_1 = require("./features/http/CreateHttpValidateQueryTransformer");
var HttpAssertFormDataTransformer_1 = require("./features/http/HttpAssertFormDataTransformer");
var HttpAssertHeadersTransformer_1 = require("./features/http/HttpAssertHeadersTransformer");
var HttpAssertQueryTransformer_1 = require("./features/http/HttpAssertQueryTransformer");
var HttpFormDataTransformer_1 = require("./features/http/HttpFormDataTransformer");
var HttpHeadersTransformer_1 = require("./features/http/HttpHeadersTransformer");
var HttpIsFormDataTransformer_1 = require("./features/http/HttpIsFormDataTransformer");
var HttpIsHeadersTransformer_1 = require("./features/http/HttpIsHeadersTransformer");
var HttpIsQueryTransformer_1 = require("./features/http/HttpIsQueryTransformer");
var HttpParameterTransformer_1 = require("./features/http/HttpParameterTransformer");
var HttpQueryTransformer_1 = require("./features/http/HttpQueryTransformer");
var HttpValidateFormDataTransformer_1 = require("./features/http/HttpValidateFormDataTransformer");
var HttpValidateHeadersTransformer_1 = require("./features/http/HttpValidateHeadersTransformer");
var HttpValidateQueryTransformer_1 = require("./features/http/HttpValidateQueryTransformer");
var JsonApplicationTransformer_1 = require("./features/json/JsonApplicationTransformer");
var JsonAssertParseTransformer_1 = require("./features/json/JsonAssertParseTransformer");
var JsonAssertStringifyTransformer_1 = require("./features/json/JsonAssertStringifyTransformer");
var JsonCreateAssertParseTransformer_1 = require("./features/json/JsonCreateAssertParseTransformer");
var JsonCreateAssertStringifyTransformer_1 = require("./features/json/JsonCreateAssertStringifyTransformer");
var JsonCreateIsParseTransformer_1 = require("./features/json/JsonCreateIsParseTransformer");
var JsonCreateIsStringifyTransformer_1 = require("./features/json/JsonCreateIsStringifyTransformer");
var JsonCreateStringifyTransformer_1 = require("./features/json/JsonCreateStringifyTransformer");
var JsonCreateValidateParseTransformer_1 = require("./features/json/JsonCreateValidateParseTransformer");
var JsonCreateValidateStringifyProgrammer_1 = require("./features/json/JsonCreateValidateStringifyProgrammer");
var JsonIsParseTransformer_1 = require("./features/json/JsonIsParseTransformer");
var JsonIsStringifyTransformer_1 = require("./features/json/JsonIsStringifyTransformer");
var JsonStringifyTransformer_1 = require("./features/json/JsonStringifyTransformer");
var JsonValidateParseTransformer_1 = require("./features/json/JsonValidateParseTransformer");
var JsonValidateStringifyTransformer_1 = require("./features/json/JsonValidateStringifyTransformer");
var LlmApplicationTransformer_1 = require("./features/llm/LlmApplicationTransformer");
var LlmSchemaTransformer_1 = require("./features/llm/LlmSchemaTransformer");
var MiscAssertCloneTransformer_1 = require("./features/misc/MiscAssertCloneTransformer");
var MiscAssertPruneTransformer_1 = require("./features/misc/MiscAssertPruneTransformer");
var MiscCloneTransformer_1 = require("./features/misc/MiscCloneTransformer");
var MiscCreateAssertCloneTransformer_1 = require("./features/misc/MiscCreateAssertCloneTransformer");
var MiscCreateAssertPruneTransformer_1 = require("./features/misc/MiscCreateAssertPruneTransformer");
var MiscCreateCloneTransformer_1 = require("./features/misc/MiscCreateCloneTransformer");
var MiscCreateIsCloneTransformer_1 = require("./features/misc/MiscCreateIsCloneTransformer");
var MiscCreateIsPruneTransformer_1 = require("./features/misc/MiscCreateIsPruneTransformer");
var MiscCreatePruneTransformer_1 = require("./features/misc/MiscCreatePruneTransformer");
var MiscCreateValidateCloneTransformer_1 = require("./features/misc/MiscCreateValidateCloneTransformer");
var MiscCreateValidatePruneTransformer_1 = require("./features/misc/MiscCreateValidatePruneTransformer");
var MiscIsCloneTransformer_1 = require("./features/misc/MiscIsCloneTransformer");
var MiscIsPruneTransformer_1 = require("./features/misc/MiscIsPruneTransformer");
var MiscLiteralsTransformer_1 = require("./features/misc/MiscLiteralsTransformer");
var MiscPruneTransformer_1 = require("./features/misc/MiscPruneTransformer");
var MiscValidateCloneTransformer_1 = require("./features/misc/MiscValidateCloneTransformer");
var MiscValidatePruneTransformer_1 = require("./features/misc/MiscValidatePruneTransformer");
var NotationAssertGeneralTransformer_1 = require("./features/notations/NotationAssertGeneralTransformer");
var NotationCreateAssertGeneralTransformer_1 = require("./features/notations/NotationCreateAssertGeneralTransformer");
var NotationCreateGeneralTransformer_1 = require("./features/notations/NotationCreateGeneralTransformer");
var NotationCreateIsGeneralTransformer_1 = require("./features/notations/NotationCreateIsGeneralTransformer");
var NotationCreateValidateGeneralTransformer_1 = require("./features/notations/NotationCreateValidateGeneralTransformer");
var NotationGeneralTransformer_1 = require("./features/notations/NotationGeneralTransformer");
var NotationIsGeneralTransformer_1 = require("./features/notations/NotationIsGeneralTransformer");
var NotationValidateGeneralTransformer_1 = require("./features/notations/NotationValidateGeneralTransformer");
var ProtobufAssertDecodeTransformer_1 = require("./features/protobuf/ProtobufAssertDecodeTransformer");
var ProtobufAssertEncodeTransformer_1 = require("./features/protobuf/ProtobufAssertEncodeTransformer");
var ProtobufCreateAssertDecodeTransformer_1 = require("./features/protobuf/ProtobufCreateAssertDecodeTransformer");
var ProtobufCreateAssertEncodeTransformer_1 = require("./features/protobuf/ProtobufCreateAssertEncodeTransformer");
var ProtobufCreateDecodeTransformer_1 = require("./features/protobuf/ProtobufCreateDecodeTransformer");
var ProtobufCreateEncodeTransformer_1 = require("./features/protobuf/ProtobufCreateEncodeTransformer");
var ProtobufCreateIsDecodeTransformer_1 = require("./features/protobuf/ProtobufCreateIsDecodeTransformer");
var ProtobufCreateIsEncodeTransformer_1 = require("./features/protobuf/ProtobufCreateIsEncodeTransformer");
var ProtobufCreateValidateDecodeTransformer_1 = require("./features/protobuf/ProtobufCreateValidateDecodeTransformer");
var ProtobufCreateValidateEncodeTransformer_1 = require("./features/protobuf/ProtobufCreateValidateEncodeTransformer");
var ProtobufDecodeTransformer_1 = require("./features/protobuf/ProtobufDecodeTransformer");
var ProtobufEncodeTransformer_1 = require("./features/protobuf/ProtobufEncodeTransformer");
var ProtobufIsDecodeTransformer_1 = require("./features/protobuf/ProtobufIsDecodeTransformer");
var ProtobufIsEncodeTransformer_1 = require("./features/protobuf/ProtobufIsEncodeTransformer");
var ProtobufMessageTransformer_1 = require("./features/protobuf/ProtobufMessageTransformer");
var ProtobufValidateDecodeTransformer_1 = require("./features/protobuf/ProtobufValidateDecodeTransformer");
var ProtobufValidateEncodeTransformer_1 = require("./features/protobuf/ProtobufValidateEncodeTransformer");
var ReflectMetadataTransformer_1 = require("./features/reflect/ReflectMetadataTransformer");
var ReflectNameTransformer_1 = require("./features/reflect/ReflectNameTransformer");
var CallExpressionTransformer;
(function (CallExpressionTransformer) {
    CallExpressionTransformer.transform = function (project) {
        return function (expression) {
            var _a, _b;
            //----
            // VALIDATIONS
            //----
            // SIGNATURE DECLARATION
            var declaration = (_a = project.checker.getResolvedSignature(expression)) === null || _a === void 0 ? void 0 : _a.declaration;
            if (!declaration)
                return expression;
            // FILE PATH
            var location = path_1.default.resolve(declaration.getSourceFile().fileName);
            if (isTarget(location) === false)
                return expression;
            //----
            // TRANSFORMATION
            //----
            // FUNCTION NAME
            var module = location.split(path_1.default.sep).at(-1).split(".")[0];
            var name = project.checker.getTypeAtLocation(declaration).symbol.name;
            // FIND TRANSFORMER
            var functor = (_b = FUNCTORS[module]) === null || _b === void 0 ? void 0 : _b[name];
            if (functor === undefined)
                return expression;
            // RETURNS WITH TRANSFORMATION
            var result = functor()(project)(expression.expression)(expression);
            return result !== null && result !== void 0 ? result : expression;
        };
    };
    var isTarget = function (location) {
        var files = Object.keys(FUNCTORS);
        return files.some(function (f) {
            return location.includes(path_1.default.join("typia", "lib", "".concat(f, ".d.ts")));
        });
    };
})(CallExpressionTransformer || (exports.CallExpressionTransformer = CallExpressionTransformer = {}));
var FUNCTORS = {
    module: {
        // BASIC
        assert: function () { return AssertTransformer_1.AssertTransformer.transform({ equals: false, guard: false }); },
        assertGuard: function () {
            return AssertTransformer_1.AssertTransformer.transform({ equals: false, guard: true });
        },
        assertType: function () {
            return AssertTransformer_1.AssertTransformer.transform({ equals: false, guard: false });
        },
        is: function () { return IsTransformer_1.IsTransformer.transform(false); },
        validate: function () { return ValidateTransformer_1.ValidateTransformer.transform(false); },
        // STRICT
        assertEquals: function () {
            return AssertTransformer_1.AssertTransformer.transform({ equals: true, guard: false });
        },
        assertGuardEquals: function () {
            return AssertTransformer_1.AssertTransformer.transform({ equals: true, guard: true });
        },
        equals: function () { return IsTransformer_1.IsTransformer.transform(true); },
        validateEquals: function () { return ValidateTransformer_1.ValidateTransformer.transform(true); },
        // RANDOM + INTERNAL
        random: function () { return RandomTransformer_1.RandomTransformer.transform; },
        metadata: function () { return function (project) { return function () {
            return ReflectMetadataTransformer_1.ReflectMetadataTransformer.transform(project);
        }; }; },
        // FACTORIES
        createAssert: function () {
            return CreateAssertTransformer_1.CreateAssertTransformer.transform({ equals: false, guard: false });
        },
        createAssertGuard: function () {
            return CreateAssertTransformer_1.CreateAssertTransformer.transform({ equals: false, guard: true });
        },
        createAssertType: function () {
            return CreateAssertTransformer_1.CreateAssertTransformer.transform({ equals: false, guard: false });
        },
        createIs: function () { return CreateIsTransformer_1.CreateIsTransformer.transform(false); },
        createValidate: function () { return CreateValidateTransformer_1.CreateValidateTransformer.transform(false); },
        createAssertEquals: function () {
            return CreateAssertTransformer_1.CreateAssertTransformer.transform({ equals: true, guard: false });
        },
        createAssertGuardEquals: function () {
            return CreateAssertTransformer_1.CreateAssertTransformer.transform({ equals: true, guard: true });
        },
        createEquals: function () { return CreateIsTransformer_1.CreateIsTransformer.transform(true); },
        createValidateEquals: function () { return CreateValidateTransformer_1.CreateValidateTransformer.transform(true); },
        createRandom: function () { return CreateRandomTransformer_1.CreateRandomTransformer.transform; },
    },
    functional: {
        // ASSERTIONS
        assertFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertFunction",
                equals: false,
                programmer: FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.write,
            });
        },
        assertParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertParameters",
                equals: false,
                programmer: FunctionalAssertParametersProgrammer_1.FunctionalAssertParametersProgrammer.write,
            });
        },
        assertReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertReturn",
                equals: false,
                programmer: FunctionalAssertReturnProgrammer_1.FunctionAssertReturnProgrammer.write,
            });
        },
        assertEqualsFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertEqualsFunction",
                equals: true,
                programmer: FunctionalAssertFunctionProgrammer_1.FunctionalAssertFunctionProgrammer.write,
            });
        },
        assertEqualsParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertEqualsParameters",
                equals: true,
                programmer: FunctionalAssertParametersProgrammer_1.FunctionalAssertParametersProgrammer.write,
            });
        },
        assertEqualsReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "assertEqualsReturn",
                equals: true,
                programmer: FunctionalAssertReturnProgrammer_1.FunctionAssertReturnProgrammer.write,
            });
        },
        // IS
        isFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "isFunction",
                equals: false,
                programmer: FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.write,
            });
        },
        isParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "isParameters",
                equals: false,
                programmer: FunctionalIsParametersProgrammer_1.FunctionalIsParametersProgrammer.write,
            });
        },
        isReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "isReturn",
                equals: false,
                programmer: FunctionalIsReturnProgrammer_1.FunctionalIsReturnProgrammer.write,
            });
        },
        equalsFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "equalsFunction",
                equals: true,
                programmer: FunctionalIsFunctionProgrammer_1.FunctionalIsFunctionProgrammer.write,
            });
        },
        equalsParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "equalsParameters",
                equals: true,
                programmer: FunctionalIsParametersProgrammer_1.FunctionalIsParametersProgrammer.write,
            });
        },
        equalsReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "equalsReturn",
                equals: true,
                programmer: FunctionalIsReturnProgrammer_1.FunctionalIsReturnProgrammer.write,
            });
        },
        // VALIDATIONS
        validateFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateFunction",
                equals: false,
                programmer: FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.write,
            });
        },
        validateParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateParameters",
                equals: false,
                programmer: FunctionalValidateParametersProgrammer_1.FunctionalValidateParametersProgrammer.write,
            });
        },
        validateReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateReturn",
                equals: false,
                programmer: FunctionalValidateReturnProgrammer_1.FunctionalValidateReturnProgrammer.write,
            });
        },
        validateEqualsFunction: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateEqualsFunction",
                equals: true,
                programmer: FunctionalValidateFunctionProgrammer_1.FunctionalValidateFunctionProgrammer.write,
            });
        },
        validateEqualsParameters: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateEqualsParameters",
                equals: true,
                programmer: FunctionalValidateParametersProgrammer_1.FunctionalValidateParametersProgrammer.write,
            });
        },
        validateEqualsReturn: function () {
            return FunctionalGenericTransformer_1.FunctionalGenericTransformer.transform({
                method: "validateEqualsReturn",
                equals: true,
                programmer: FunctionalValidateReturnProgrammer_1.FunctionalValidateReturnProgrammer.write,
            });
        },
    },
    http: {
        // FORM-DATA
        formData: function () { return HttpFormDataTransformer_1.HttpFormDataTransformer.transform; },
        isFormData: function () { return HttpIsFormDataTransformer_1.HttpIsFormDataTransformer.transform; },
        assertFormData: function () { return HttpAssertFormDataTransformer_1.HttpAssertFormDataTransformer.transform; },
        validateFormData: function () { return HttpValidateFormDataTransformer_1.HttpValidateFormDataTransformer.transform; },
        // HEADERS
        headers: function () { return HttpHeadersTransformer_1.HttpHeadersTransformer.transform; },
        isHeaders: function () { return HttpIsHeadersTransformer_1.HttpIsHeadersTransformer.transform; },
        assertHeaders: function () { return HttpAssertHeadersTransformer_1.HttpAssertHeadersTransformer.transform; },
        validateHeaders: function () { return HttpValidateHeadersTransformer_1.HttpValidateHeadersTransformer.transform; },
        // PARAMETER
        parameter: function () { return HttpParameterTransformer_1.HttpParameterTransformer.transform; },
        // QUERY
        query: function () { return HttpQueryTransformer_1.HttpQueryTransformer.transform; },
        isQuery: function () { return HttpIsQueryTransformer_1.HttpIsQueryTransformer.transform; },
        assertQuery: function () { return HttpAssertQueryTransformer_1.HttpAssertQueryTransformer.transform; },
        validateQuery: function () { return HttpValidateQueryTransformer_1.HttpValidateQueryTransformer.transform; },
        // FACTORIES
        createFormData: function () { return CreateHttpFormDataTransformer_1.CreateHttpFormDataTransformer.transform; },
        createIsFormData: function () { return CreateHttpIsFormDataTransformer_1.CreateHttpIsFormDataTransformer.transform; },
        createAssertFormData: function () { return CreateHttpAssertFormDataTransformer_1.CreateHttpAssertFormDataTransformer.transform; },
        createValidateFormData: function () {
            return CreateHttpValidateFormDataTransformer_1.CreateHttpValidateFormDataTransformer.transform;
        },
        createHeaders: function () { return CreateHttpHeadersTransformer_1.CreateHttpHeadersTransformer.transform; },
        createIsHeaders: function () { return CreateHttpIsHeadersTransformer_1.CreateHttpIsHeadersTransformer.transform; },
        createAssertHeaders: function () { return CreateHttpAssertHeadersTransformer_1.CreateHttpAssertHeadersTransformer.transform; },
        createValidateHeaders: function () { return CreateHttpValidateHeadersTransformer_1.CreateHttpValidateHeadersTransformer.transform; },
        createParameter: function () { return CreateHttpParameterTransformer_1.CreateHttpParameterTransformer.transform; },
        createQuery: function () { return CreateHttpQueryTransformer_1.CreateHttpQueryTransformer.transform; },
        createIsQuery: function () { return CreateHttpIsQueryTransformer_1.CreateHttpIsQueryTransformer.transform; },
        createAssertQuery: function () { return CreateHttpAssertQueryTransformer_1.CreateHttpAssertQueryTransformer.transform; },
        createValidateQuery: function () { return CreateHttpValidateQueryTransformer_1.CreateHttpValidateQueryTransformer.transform; },
    },
    llm: {
        application: function () { return function (project) {
            return LlmApplicationTransformer_1.LlmApplicationTransformer.transform(project);
        }; },
        schema: function () { return function (project) { return function () { return LlmSchemaTransformer_1.LlmSchemaTransformer.transform(project); }; }; },
    },
    json: {
        // SCHEMA
        application: function () { return function (project) { return function () {
            return JsonApplicationTransformer_1.JsonApplicationTransformer.transform(project);
        }; }; },
        // PARSER
        isParse: function () { return JsonIsParseTransformer_1.JsonIsParseTransformer.transform; },
        assertParse: function () { return JsonAssertParseTransformer_1.JsonAssertParseTransformer.transform; },
        validateParse: function () { return JsonValidateParseTransformer_1.JsonValidateParseTransformer.transform; },
        // STRINGIFY
        stringify: function () { return JsonStringifyTransformer_1.JsonStringifyTransformer.transform; },
        assertStringify: function () { return JsonAssertStringifyTransformer_1.JsonAssertStringifyTransformer.transform; },
        isStringify: function () { return JsonIsStringifyTransformer_1.JsonIsStringifyTransformer.transform; },
        validateStringify: function () { return JsonValidateStringifyTransformer_1.JsonValidateStringifyTransformer.transform; },
        // FACTORIES
        createIsParse: function () { return JsonCreateIsParseTransformer_1.JsonCreateIsParseTransformer.transform; },
        createAssertParse: function () { return JsonCreateAssertParseTransformer_1.JsonCreateAssertParseTransformer.transform; },
        createValidateParse: function () { return JsonCreateValidateParseTransformer_1.JsonCreateValidateParseTransformer.transform; },
        createStringify: function () { return JsonCreateStringifyTransformer_1.JsonCreateStringifyTransformer.transform; },
        createAssertStringify: function () { return JsonCreateAssertStringifyTransformer_1.JsonCreateAssertStringifyTransformer.transform; },
        createIsStringify: function () { return JsonCreateIsStringifyTransformer_1.JsonCreateIsStringifyTransformer.transform; },
        createValidateStringify: function () {
            return JsonCreateValidateStringifyProgrammer_1.JsonCreateValidateStringifyTransformer.transform;
        },
    },
    protobuf: {
        // SCHEMA
        message: function () { return ProtobufMessageTransformer_1.ProtobufMessageTransformer.transform; },
        // ENCODE
        encode: function () { return ProtobufEncodeTransformer_1.ProtobufEncodeTransformer.transform; },
        assertEncode: function () { return ProtobufAssertEncodeTransformer_1.ProtobufAssertEncodeTransformer.transform; },
        isEncode: function () { return ProtobufIsEncodeTransformer_1.ProtobufIsEncodeTransformer.transform; },
        validateEncode: function () { return ProtobufValidateEncodeTransformer_1.ProtobufValidateEncodeTransformer.transform; },
        // DECODE
        decode: function () { return ProtobufDecodeTransformer_1.ProtobufDecodeTransformer.transform; },
        assertDecode: function () { return ProtobufAssertDecodeTransformer_1.ProtobufAssertDecodeTransformer.transform; },
        isDecode: function () { return ProtobufIsDecodeTransformer_1.ProtobufIsDecodeTransformer.transform; },
        validateDecode: function () { return ProtobufValidateDecodeTransformer_1.ProtobufValidateDecodeTransformer.transform; },
        // FACTORIES
        createEncode: function () { return ProtobufCreateEncodeTransformer_1.ProtobufCreateEncodeTransformer.transform; },
        createAssertEncode: function () { return ProtobufCreateAssertEncodeTransformer_1.ProtobufCreateAssertEncodeTransformer.transform; },
        createIsEncode: function () { return ProtobufCreateIsEncodeTransformer_1.ProtobufCreateIsEncodeTransformer.transform; },
        createValidateEncode: function () {
            return ProtobufCreateValidateEncodeTransformer_1.ProtobufCreateValidateEncodeTransformer.transform;
        },
        createDecode: function () { return ProtobufCreateDecodeTransformer_1.ProtobufCreateDecodeTransformer.transform; },
        createAssertDecode: function () { return ProtobufCreateAssertDecodeTransformer_1.ProtobufCreateAssertDecodeTransformer.transform; },
        createIsDecode: function () { return ProtobufCreateIsDecodeTransformer_1.ProtobufCreateIsDecodeTransformer.transform; },
        createValidateDecode: function () {
            return ProtobufCreateValidateDecodeTransformer_1.ProtobufCreateValidateDecodeTransformer.transform;
        },
    },
    reflect: {
        metadata: function () { return function (project) { return function () {
            return ReflectMetadataTransformer_1.ReflectMetadataTransformer.transform(project);
        }; }; },
        name: function () { return function (project) { return function () { return ReflectNameTransformer_1.ReflectNameTransformer.transform(project); }; }; },
    },
    misc: {
        literals: function () { return function (project) { return function () {
            return MiscLiteralsTransformer_1.MiscLiteralsTransformer.transform(project);
        }; }; },
        // CLONE
        clone: function () { return MiscCloneTransformer_1.MiscCloneTransformer.transform; },
        assertClone: function () { return MiscAssertCloneTransformer_1.MiscAssertCloneTransformer.transform; },
        isClone: function () { return MiscIsCloneTransformer_1.MiscIsCloneTransformer.transform; },
        validateClone: function () { return MiscValidateCloneTransformer_1.MiscValidateCloneTransformer.transform; },
        // PRUNE
        prune: function () { return MiscPruneTransformer_1.MiscPruneTransformer.transform; },
        assertPrune: function () { return MiscAssertPruneTransformer_1.MiscAssertPruneTransformer.transform; },
        isPrune: function () { return MiscIsPruneTransformer_1.MiscIsPruneTransformer.transform; },
        validatePrune: function () { return MiscValidatePruneTransformer_1.MiscValidatePruneTransformer.transform; },
        // FACTORIES
        createClone: function () { return MiscCreateCloneTransformer_1.MiscCreateCloneTransformer.transform; },
        createAssertClone: function () { return MiscCreateAssertCloneTransformer_1.MiscCreateAssertCloneTransformer.transform; },
        createIsClone: function () { return MiscCreateIsCloneTransformer_1.MiscCreateIsCloneTransformer.transform; },
        createValidateClone: function () { return MiscCreateValidateCloneTransformer_1.MiscCreateValidateCloneTransformer.transform; },
        createPrune: function () { return MiscCreatePruneTransformer_1.MiscCreatePruneTransformer.transform; },
        createAssertPrune: function () { return MiscCreateAssertPruneTransformer_1.MiscCreateAssertPruneTransformer.transform; },
        createIsPrune: function () { return MiscCreateIsPruneTransformer_1.MiscCreateIsPruneTransformer.transform; },
        createValidatePrune: function () { return MiscCreateValidatePruneTransformer_1.MiscCreateValidatePruneTransformer.transform; },
    },
    notations: {
        // CAMEL
        camel: function () { return NotationGeneralTransformer_1.NotationGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel); },
        assertCamel: function () {
            return NotationAssertGeneralTransformer_1.NotationAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        isCamel: function () {
            return NotationIsGeneralTransformer_1.NotationIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        validateCamel: function () {
            return NotationValidateGeneralTransformer_1.NotationValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        // PASCAL
        pascal: function () { return NotationGeneralTransformer_1.NotationGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal); },
        assertPascal: function () {
            return NotationAssertGeneralTransformer_1.NotationAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        isPascal: function () {
            return NotationIsGeneralTransformer_1.NotationIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        validatePascal: function () {
            return NotationValidateGeneralTransformer_1.NotationValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        // SNAKE
        snake: function () { return NotationGeneralTransformer_1.NotationGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake); },
        assertSnake: function () {
            return NotationAssertGeneralTransformer_1.NotationAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        isSnake: function () {
            return NotationIsGeneralTransformer_1.NotationIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        validateSnake: function () {
            return NotationValidateGeneralTransformer_1.NotationValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        // FACTORIES
        createCamel: function () {
            return NotationCreateGeneralTransformer_1.NotationCreateGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        createAssertCamel: function () {
            return NotationCreateAssertGeneralTransformer_1.NotationCreateAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        createIsCamel: function () {
            return NotationCreateIsGeneralTransformer_1.NotationCreateIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        createValidateCamel: function () {
            return NotationCreateValidateGeneralTransformer_1.NotationCreateValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.camel);
        },
        createPascal: function () {
            return NotationCreateGeneralTransformer_1.NotationCreateGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        createAssertPascal: function () {
            return NotationCreateAssertGeneralTransformer_1.NotationCreateAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        createIsPascal: function () {
            return NotationCreateIsGeneralTransformer_1.NotationCreateIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        createValidatePascal: function () {
            return NotationCreateValidateGeneralTransformer_1.NotationCreateValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.pascal);
        },
        createSnake: function () {
            return NotationCreateGeneralTransformer_1.NotationCreateGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        createAssertSnake: function () {
            return NotationCreateAssertGeneralTransformer_1.NotationCreateAssertGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        createIsSnake: function () {
            return NotationCreateIsGeneralTransformer_1.NotationCreateIsGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
        createValidateSnake: function () {
            return NotationCreateValidateGeneralTransformer_1.NotationCreateValidateGeneralTransformer.transform(NamingConvention_1.NamingConvention.snake);
        },
    },
};
//# sourceMappingURL=CallExpressionTransformer.js.map