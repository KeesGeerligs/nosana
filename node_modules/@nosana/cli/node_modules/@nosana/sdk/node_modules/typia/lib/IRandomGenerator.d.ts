import { Customizable } from "./typings/Customizable";
export interface IRandomGenerator {
    boolean(): boolean;
    integer(minimum?: number, maximum?: number): number;
    bigint(minimum?: bigint, maximum?: bigint): bigint;
    number(minimum?: number, maximum?: number): number;
    string(length?: number): string;
    array<T>(closure: (index: number) => T, count?: number, unique?: boolean): T[];
    length(): number;
    pattern(regex: RegExp): string;
    byte(): string;
    password(): string;
    regex(): string;
    uuid(): string;
    email(): string;
    hostname(): string;
    idnEmail(): string;
    idnHostname(): string;
    iri(): string;
    iriReference(): string;
    ipv4(): string;
    ipv6(): string;
    uri(): string;
    uriReference(): string;
    uriTemplate(): string;
    url(): string;
    datetime(minimum?: number, maximum?: number): string;
    date(minimum?: number, maximum?: number): string;
    time(): string;
    duration(): string;
    jsonPointer(): string;
    relativeJsonPointer(): string;
    customs?: IRandomGenerator.CustomMap;
}
export declare namespace IRandomGenerator {
    type CustomMap = {
        [Type in keyof Customizable]?: (tags: ITypeTag[]) => Customizable[Type] | undefined;
    };
    interface ITypeTag {
        name: string;
        kind: string;
        value: any;
    }
}
