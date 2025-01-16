import ts from "typescript";
import { IProject } from "../../transformers/IProject";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionImporter } from "../helpers/FunctionImporter";
export declare namespace HttpValidateQueryProgrammer {
    const decompose: (props: {
        project: IProject;
        modulo: ts.LeftHandSideExpression;
        importer: FunctionImporter;
        type: ts.Type;
        name: string | undefined;
        allowOptional: boolean;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression, allowOptional?: boolean) => (type: ts.Type, name?: string) => ts.CallExpression;
}
