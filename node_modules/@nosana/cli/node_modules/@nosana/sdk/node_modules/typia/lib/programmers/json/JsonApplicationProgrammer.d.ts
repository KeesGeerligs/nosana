import { IJsonApplication } from "../../schemas/json/IJsonApplication";
import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace JsonApplicationProgrammer {
    const validate: (meta: Metadata) => string[];
    const write: <Version extends "3.0" | "3.1">(version: Version) => ((metadatas: Array<Metadata>) => IJsonApplication<"3.0">) | ((metadatas: Array<Metadata>) => IJsonApplication<"3.1">);
}
