import { MetadataObject } from "../schemas/metadata/MetadataObject";
export declare namespace MetadataTypeTagSchemaFactory {
    const object: (report: (msg: string) => false) => (obj: MetadataObject) => object | undefined;
}
