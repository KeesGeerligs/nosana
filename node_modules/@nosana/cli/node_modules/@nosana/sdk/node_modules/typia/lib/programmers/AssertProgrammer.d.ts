import ts from "typescript";
import { IProject } from "../transformers/IProject";
import { FeatureProgrammer } from "./FeatureProgrammer";
import { FunctionImporter } from "./helpers/FunctionImporter";
export declare namespace AssertProgrammer {
    const decompose: (props: {
        project: IProject;
        equals: boolean;
        guard: boolean;
        importer: FunctionImporter;
        type: ts.Type;
        name: string | undefined;
        init: ts.Expression | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (props: boolean | {
        equals: boolean;
        guard: boolean;
    }) => (type: ts.Type, name?: string, init?: ts.Expression) => ts.CallExpression;
    namespace Guardian {
        const identifier: () => ts.Identifier;
        const parameter: (init: ts.Expression | undefined) => ts.ParameterDeclaration;
        const type: () => ts.FunctionTypeNode;
    }
}
