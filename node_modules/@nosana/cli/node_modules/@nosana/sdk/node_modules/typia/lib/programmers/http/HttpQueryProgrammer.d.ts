import ts from "typescript";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProject } from "../../transformers/IProject";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionImporter } from "../helpers/FunctionImporter";
export declare namespace HttpQueryProgrammer {
    const INPUT_TYPE = "string | URLSearchParams";
    const decompose: (props: {
        project: IProject;
        importer: FunctionImporter;
        allowOptional: boolean;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (project: IProject) => (modulo: ts.LeftHandSideExpression, allowOptional?: boolean) => (type: ts.Type, name?: string) => ts.CallExpression;
    const validate: (meta: Metadata, explore: MetadataFactory.IExplore, allowOptional?: boolean) => string[];
}
