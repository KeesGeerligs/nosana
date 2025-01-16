import { ILlmSchema } from "@samchon/openapi";
import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace LlmSchemaProgrammer {
    const validate: (meta: Metadata) => string[];
    const write: (metadata: Metadata) => ILlmSchema;
}
