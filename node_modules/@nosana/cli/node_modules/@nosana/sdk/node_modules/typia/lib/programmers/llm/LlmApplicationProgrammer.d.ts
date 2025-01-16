import { ILlmApplication } from "@samchon/openapi";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace LlmApplicationProgrammer {
    const validate: (meta: Metadata, explore: MetadataFactory.IExplore) => string[];
    const write: (metadata: Metadata) => ILlmApplication;
}
