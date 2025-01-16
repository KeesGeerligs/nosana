import ts from "typescript";
import { IProject } from "../../IProject";
export declare namespace LlmSchemaTransformer {
    const transform: (project: IProject) => (expression: ts.CallExpression) => ts.Expression;
}
