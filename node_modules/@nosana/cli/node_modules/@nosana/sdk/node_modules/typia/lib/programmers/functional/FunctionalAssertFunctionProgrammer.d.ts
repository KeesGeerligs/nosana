import ts from "typescript";
import { IProject } from "../../transformers/IProject";
export declare namespace FunctionalAssertFunctionProgrammer {
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (equals: boolean) => (expression: ts.Expression, declaration: ts.FunctionDeclaration, init?: ts.Expression) => ts.CallExpression;
    const errorFactoryWrapper: (modulo: ts.LeftHandSideExpression) => (paramters: readonly ts.ParameterDeclaration[]) => (init: ts.Expression | undefined) => {
        name: string;
        variable: ts.VariableStatement;
    };
    const hookPath: (props: {
        wrapper: string;
        replacer: string;
    }) => ts.ArrowFunction;
}
