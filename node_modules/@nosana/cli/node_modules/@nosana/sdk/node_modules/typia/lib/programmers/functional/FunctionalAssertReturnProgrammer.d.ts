import ts from "typescript";
import { IProject } from "../../transformers/IProject";
export declare namespace FunctionAssertReturnProgrammer {
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration, init?: ts.Expression) => ts.CallExpression;
    const decompose: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration, wrapper: string) => {
        async: boolean;
        functions: ts.Statement[];
        value: ts.Expression;
    };
}
