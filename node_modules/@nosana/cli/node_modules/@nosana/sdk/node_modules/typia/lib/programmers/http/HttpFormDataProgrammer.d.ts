import ts from "typescript";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProject } from "../../transformers/IProject";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionImporter } from "../helpers/FunctionImporter";
export declare namespace HttpFormDataProgrammer {
    const decompose: (props: {
        project: IProject;
        importer: FunctionImporter;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression) => (type: ts.Type, name?: string) => ts.CallExpression;
    const validate: (meta: Metadata, explore: MetadataFactory.IExplore) => string[];
}
