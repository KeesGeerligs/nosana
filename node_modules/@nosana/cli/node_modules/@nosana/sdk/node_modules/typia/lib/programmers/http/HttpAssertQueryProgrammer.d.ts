import ts from "typescript";
import { IProject } from "../../transformers/IProject";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionImporter } from "../helpers/FunctionImporter";
export declare namespace HttpAssertQueryProgrammer {
    const decompose: (props: {
        project: IProject;
        importer: FunctionImporter;
        type: ts.Type;
        name: string | undefined;
        init: ts.Expression | undefined;
        allowOptional: boolean;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression, allowOptional?: boolean) => (type: ts.Type, name?: string, init?: ts.Expression) => ts.CallExpression;
}
