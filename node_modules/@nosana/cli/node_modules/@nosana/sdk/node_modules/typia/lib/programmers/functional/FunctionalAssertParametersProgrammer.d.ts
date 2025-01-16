import ts from "typescript";
import { IProject } from "../../transformers/IProject";
export declare namespace FunctionalAssertParametersProgrammer {
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration, init?: ts.Expression) => ts.CallExpression;
    const decompose: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (parameters: readonly ts.ParameterDeclaration[], wrapper: string) => {
        functions: ts.Statement[];
        expressions: ts.Expression[];
    };
}
