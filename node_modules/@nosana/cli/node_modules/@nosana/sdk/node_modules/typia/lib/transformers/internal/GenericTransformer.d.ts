import ts from "typescript";
import { IProject } from "../IProject";
export declare namespace GenericTransformer {
    const scalar: (method: string) => (programmer: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (type: ts.Type, name: string) => ts.Expression | ts.ArrowFunction) => (project: IProject) => (modulo: ts.LeftHandSideExpression) => (expression: ts.CallExpression) => ts.CallExpression;
    const factory: (method: string) => (programmer: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (type: ts.Type, name: string, init?: ts.Expression) => ts.Expression | ts.ArrowFunction) => (project: IProject) => (modulo: ts.LeftHandSideExpression) => (expression: ts.CallExpression) => ts.Expression | ts.ArrowFunction;
}
