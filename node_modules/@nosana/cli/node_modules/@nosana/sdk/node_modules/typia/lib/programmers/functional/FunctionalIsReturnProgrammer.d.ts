import ts from "typescript";
import { IProject } from "../../transformers/IProject";
export declare namespace FunctionalIsReturnProgrammer {
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration) => ts.CallExpression;
    const decompose: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration) => {
        async: boolean;
        functions: ts.Statement[];
        statements: ts.Statement[];
    };
}
