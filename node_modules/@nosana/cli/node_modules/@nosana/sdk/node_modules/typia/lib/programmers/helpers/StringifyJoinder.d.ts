import ts from "typescript";
import { FunctionImporter } from "./FunctionImporter";
import { IExpressionEntry } from "./IExpressionEntry";
export declare namespace StringifyJoiner {
    const object: (importer: FunctionImporter) => (_input: ts.Expression, entries: IExpressionEntry<ts.Expression>[]) => ts.Expression;
    const array: (input: ts.Expression, arrow: ts.ArrowFunction) => ts.Expression;
    const tuple: (children: ts.Expression[], rest: ts.Expression | null) => ts.Expression;
}
