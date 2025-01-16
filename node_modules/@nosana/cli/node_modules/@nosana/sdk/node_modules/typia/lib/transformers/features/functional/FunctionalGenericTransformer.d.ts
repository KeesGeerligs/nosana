import ts from "typescript";
import { IProject } from "../../IProject";
export declare namespace FunctionalGenericTransformer {
    const transform: (props: {
        method: string;
        programmer: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration, init?: ts.Expression) => ts.Expression;
        equals: boolean;
    }) => (project: IProject) => (modulo: ts.LeftHandSideExpression) => (expression: ts.CallExpression) => ts.Expression;
}
