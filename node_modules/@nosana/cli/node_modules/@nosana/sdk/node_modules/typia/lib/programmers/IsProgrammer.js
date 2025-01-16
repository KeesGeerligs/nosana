"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsProgrammer = void 0;
var typescript_1 = __importDefault(require("typescript"));
var ExpressionFactory_1 = require("../factories/ExpressionFactory");
var IdentifierFactory_1 = require("../factories/IdentifierFactory");
var ValueFactory_1 = require("../factories/ValueFactory");
var CheckerProgrammer_1 = require("./CheckerProgrammer");
var FeatureProgrammer_1 = require("./FeatureProgrammer");
var FunctionImporter_1 = require("./helpers/FunctionImporter");
var OptionPredicator_1 = require("./helpers/OptionPredicator");
var check_object_1 = require("./internal/check_object");
var IsProgrammer;
(function (IsProgrammer) {
    IsProgrammer.configure = function (options) {
        return function (project) {
            return function (importer) { return ({
                prefix: "$i",
                equals: !!(options === null || options === void 0 ? void 0 : options.object),
                trace: false,
                path: false,
                numeric: OptionPredicator_1.OptionPredicator.numeric({
                    numeric: options === null || options === void 0 ? void 0 : options.numeric,
                }),
                atomist: function () { return function (entry) { return function () {
                    return __spreadArray(__spreadArray([], __read((entry.expression ? [entry.expression] : [])), false), __read((entry.conditions.length === 0
                        ? []
                        : [
                            entry.conditions
                                .map(function (set) {
                                return set
                                    .map(function (s) { return s.expression; })
                                    .reduce(function (a, b) { return typescript_1.default.factory.createLogicalAnd(a, b); });
                            })
                                .reduce(function (a, b) { return typescript_1.default.factory.createLogicalOr(a, b); }),
                        ])), false).reduce(function (x, y) { return typescript_1.default.factory.createLogicalAnd(x, y); });
                }; }; },
                combiner: function () { return function (type) {
                    var initial = type === "and" ? typescript_1.default.factory.createTrue() : typescript_1.default.factory.createFalse();
                    var binder = type === "and"
                        ? typescript_1.default.factory.createLogicalAnd
                        : typescript_1.default.factory.createLogicalOr;
                    return function (_input, binaries) {
                        return binaries.length
                            ? binaries
                                .map(function (binary) { return binary.expression; })
                                .reduce(function (x, y) { return binder(x, y); })
                            : initial;
                    };
                }; },
                joiner: {
                    object: (options === null || options === void 0 ? void 0 : options.object) ||
                        (0, check_object_1.check_object)({
                            equals: !!(options === null || options === void 0 ? void 0 : options.object),
                            undefined: OptionPredicator_1.OptionPredicator.undefined({
                                undefined: options === null || options === void 0 ? void 0 : options.undefined,
                            }),
                            assert: true,
                            reduce: typescript_1.default.factory.createLogicalAnd,
                            positive: typescript_1.default.factory.createTrue(),
                            superfluous: function () { return typescript_1.default.factory.createFalse(); },
                        })(project)(importer),
                    array: function (input, arrow) {
                        return typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(input)("every"), undefined, [arrow]);
                    },
                    failure: function () { return typescript_1.default.factory.createFalse(); },
                },
                success: typescript_1.default.factory.createTrue(),
            }); };
        };
    };
    /* -----------------------------------------------------------
      WRITERS
    ----------------------------------------------------------- */
    IsProgrammer.decompose = function (props) {
        // CONFIGURATION
        var config = __assign(__assign({}, IsProgrammer.configure({
            object: (0, check_object_1.check_object)({
                equals: props.equals,
                undefined: OptionPredicator_1.OptionPredicator.undefined(props.project.options),
                assert: true,
                reduce: typescript_1.default.factory.createLogicalAnd,
                positive: typescript_1.default.factory.createTrue(),
                superfluous: function () { return typescript_1.default.factory.createFalse(); },
            })(props.project)(props.importer),
            numeric: OptionPredicator_1.OptionPredicator.numeric(props.project.options),
        })(props.project)(props.importer)), { trace: props.equals });
        // COMPOSITION
        var composed = CheckerProgrammer_1.CheckerProgrammer.compose(__assign(__assign({}, props), { config: config }));
        return {
            functions: composed.functions,
            statements: composed.statements,
            arrow: typescript_1.default.factory.createArrowFunction(undefined, undefined, composed.parameters, composed.response, undefined, composed.body),
        };
    };
    IsProgrammer.write = function (project) {
        return function (modulo) {
            return function (equals) {
                return function (type, name) {
                    var importer = new FunctionImporter_1.FunctionImporter(modulo.getText());
                    var result = IsProgrammer.decompose({
                        equals: equals,
                        project: project,
                        importer: importer,
                        type: type,
                        name: name,
                    });
                    return FeatureProgrammer_1.FeatureProgrammer.writeDecomposed({
                        modulo: modulo,
                        importer: importer,
                        result: result,
                    });
                };
            };
        };
    };
    IsProgrammer.write_function_statements = function (project) {
        return function (importer) {
            return function (collection) {
                var config = IsProgrammer.configure()(project)(importer);
                var objects = CheckerProgrammer_1.CheckerProgrammer.write_object_functions(project)(config)(importer)(collection);
                var unions = CheckerProgrammer_1.CheckerProgrammer.write_union_functions(project)(config)(importer)(collection);
                var arrays = CheckerProgrammer_1.CheckerProgrammer.write_array_functions(project)(config)(importer)(collection);
                var tuples = CheckerProgrammer_1.CheckerProgrammer.write_tuple_functions(project)(config)(importer)(collection);
                return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(objects.filter(function (_, i) { return importer.hasLocal("".concat(config.prefix, "o").concat(i)); })), false), __read(unions.filter(function (_, i) { return importer.hasLocal("".concat(config.prefix, "u").concat(i)); })), false), __read(arrays.filter(function (_, i) { return importer.hasLocal("".concat(config.prefix, "a").concat(i)); })), false), __read(tuples.filter(function (_, i) { return importer.hasLocal("".concat(config.prefix, "t").concat(i)); })), false);
            };
        };
    };
    /* -----------------------------------------------------------
          DECODERS
      ----------------------------------------------------------- */
    IsProgrammer.decode = function (project) { return function (importer) {
        return CheckerProgrammer_1.CheckerProgrammer.decode(project)(IsProgrammer.configure()(project)(importer))(importer);
    }; };
    IsProgrammer.decode_object = function (project) { return function (importer) {
        return CheckerProgrammer_1.CheckerProgrammer.decode_object(IsProgrammer.configure()(project)(importer))(importer);
    }; };
    IsProgrammer.decode_to_json = function (checkNull) {
        return function (input) {
            return typescript_1.default.factory.createLogicalAnd(ExpressionFactory_1.ExpressionFactory.isObject({
                checkArray: false,
                checkNull: checkNull,
            })(input), typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("function"), ValueFactory_1.ValueFactory.TYPEOF(IdentifierFactory_1.IdentifierFactory.access(input)("toJSON"))));
        };
    };
    IsProgrammer.decode_functional = function (input) {
        return typescript_1.default.factory.createStrictEquality(typescript_1.default.factory.createStringLiteral("function"), ValueFactory_1.ValueFactory.TYPEOF(input));
    };
})(IsProgrammer || (exports.IsProgrammer = IsProgrammer = {}));
//# sourceMappingURL=IsProgrammer.js.map