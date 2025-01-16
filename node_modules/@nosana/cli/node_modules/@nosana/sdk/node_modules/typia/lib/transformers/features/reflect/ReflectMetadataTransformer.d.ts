import ts from "typescript";
import { IProject } from "../../IProject";
export declare namespace ReflectMetadataTransformer {
    const transform: (project: IProject) => (expression: ts.CallExpression) => ts.Expression;
}
