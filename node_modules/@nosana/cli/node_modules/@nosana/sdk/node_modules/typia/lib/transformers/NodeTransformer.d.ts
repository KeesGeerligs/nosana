import ts from "typescript";
import { IProject } from "./IProject";
export declare namespace NodeTransformer {
    const transform: (project: IProject) => (expression: ts.Node) => ts.Node | null;
}
