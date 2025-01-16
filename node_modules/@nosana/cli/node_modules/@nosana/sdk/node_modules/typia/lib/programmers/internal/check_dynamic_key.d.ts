import ts from "typescript";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProject } from "../../transformers/IProject";
import { FunctionImporter } from "../helpers/FunctionImporter";
export declare const check_dynamic_key: (project: IProject) => (importer: FunctionImporter) => (input: ts.Expression, metadata: Metadata) => ts.Expression;
