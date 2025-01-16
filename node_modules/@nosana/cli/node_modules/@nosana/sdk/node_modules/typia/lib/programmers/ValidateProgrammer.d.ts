import ts from "typescript";
import { IProject } from "../transformers/IProject";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionImporter } from "./helpers/FunctionImporter";
export declare namespace ValidateProgrammer {
    const decompose: (props: {
        project: IProject;
        modulo: ts.LeftHandSideExpression;
        importer: FunctionImporter;
        equals: boolean;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (type: ts.Type, name?: string) => ts.CallExpression;
}
