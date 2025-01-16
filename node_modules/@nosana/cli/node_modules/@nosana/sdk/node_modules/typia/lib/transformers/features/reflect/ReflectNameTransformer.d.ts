import ts from "typescript";
import { IProject } from "../../IProject";
export declare namespace ReflectNameTransformer {
    const transform: (project: IProject) => (expression: ts.CallExpression) => ts.Expression;
}
