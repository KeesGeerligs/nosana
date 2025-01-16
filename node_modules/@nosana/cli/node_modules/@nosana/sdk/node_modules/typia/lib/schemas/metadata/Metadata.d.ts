import { IMetadata } from "./IMetadata";
import { IMetadataDictionary } from "./IMetadataDictionary";
import { MetadataAlias } from "./MetadataAlias";
import { MetadataArray } from "./MetadataArray";
import { MetadataAtomic } from "./MetadataAtomic";
import { MetadataConstant } from "./MetadataConstant";
import { MetadataEscaped } from "./MetadataEscaped";
import { MetadataFunction } from "./MetadataFunction";
import { MetadataObject } from "./MetadataObject";
import { MetadataTemplate } from "./MetadataTemplate";
import { MetadataTuple } from "./MetadataTuple";
export declare class Metadata {
    any: boolean;
    required: boolean;
    optional: boolean;
    nullable: boolean;
    escaped: MetadataEscaped | null;
    atomics: MetadataAtomic[];
    constants: MetadataConstant[];
    templates: MetadataTemplate[];
    rest: Metadata | null;
    aliases: MetadataAlias[];
    arrays: MetadataArray[];
    tuples: MetadataTuple[];
    objects: MetadataObject[];
    functions: MetadataFunction[];
    natives: string[];
    sets: Metadata[];
    maps: Metadata.Entry[];
    /**
     * @hidden
     */
    private constructor();
    toJSON(): IMetadata;
    static from(meta: IMetadata, dict: IMetadataDictionary): Metadata;
    getName(): string;
    empty(): boolean;
    size(): number;
    bucket(): number;
    isConstant(): boolean;
    isRequired(): boolean;
    isSoleLiteral(): boolean;
}
export declare namespace Metadata {
    const intersects: (x: Metadata, y: Metadata) => boolean;
    const covers: (x: Metadata, y: Metadata, level?: number, escaped?: boolean) => boolean;
}
export declare namespace Metadata {
    interface Entry {
        key: Metadata;
        value: Metadata;
    }
}
