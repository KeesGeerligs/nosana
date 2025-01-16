import ts from "typescript";
import { MetadataCollection } from "../factories/MetadataCollection";
import { IProject } from "../transformers/IProject";
import { CheckerProgrammer } from "./CheckerProgrammer";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionImporter } from "./helpers/FunctionImporter";
import { IExpressionEntry } from "./helpers/IExpressionEntry";
export declare namespace IsProgrammer {
    const configure: (options?: Partial<CONFIG.IOptions>) => (project: IProject) => (importer: FunctionImporter) => CheckerProgrammer.IConfig;
    namespace CONFIG {
        interface IOptions {
            numeric: boolean;
            undefined: boolean;
            object: (input: ts.Expression, entries: IExpressionEntry<ts.Expression>[]) => ts.Expression;
        }
    }
    const decompose: (props: {
        project: IProject;
        importer: FunctionImporter;
        equals: boolean;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (type: ts.Type, name?: string) => ts.CallExpression;
    const write_function_statements: (project: IProject) => (importer: FunctionImporter) => (collection: MetadataCollection) => ts.VariableStatement[];
    const decode: (project: IProject) => (importer: FunctionImporter) => (input: ts.Expression, meta: import("../schemas/metadata/Metadata").Metadata, explore: CheckerProgrammer.IExplore) => ts.Expression;
    const decode_object: (project: IProject) => (importer: FunctionImporter) => (input: ts.Expression, obj: import("../schemas/metadata/MetadataObject").MetadataObject, explore: CheckerProgrammer.IExplore) => ts.CallExpression;
    const decode_to_json: (checkNull: boolean) => (input: ts.Expression) => ts.Expression;
    const decode_functional: (input: ts.Expression) => ts.BinaryExpression;
}
