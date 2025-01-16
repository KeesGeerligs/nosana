import type { OpenApi, OpenApiV3 } from "@samchon/openapi";
export type IJsonApplication<Version extends "3.0" | "3.1" = "3.1", Types = unknown[]> = Version extends "3.0" ? IJsonApplication.IV3_0<Types> : IJsonApplication.IV3_1<Types>;
export declare namespace IJsonApplication {
    interface IV3_0<Types = unknown[]> {
        version: "3.0";
        schemas: OpenApiV3.IJsonSchema[];
        components: OpenApiV3.IComponents;
        __types?: Types | undefined;
    }
    interface IV3_1<Types = unknown[]> {
        version: "3.1";
        components: OpenApi.IComponents;
        schemas: OpenApi.IJsonSchema[];
        __types?: Types | undefined;
    }
}
