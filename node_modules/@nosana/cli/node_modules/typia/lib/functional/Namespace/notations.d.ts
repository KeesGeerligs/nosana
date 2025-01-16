export declare const camel: (method: string) => {
    any: (input: any) => any;
    throws: (props: Pick<import("../..").TypeGuardError.IProps, "value" | "expected">) => never;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
export declare const pascal: (method: string) => {
    any: (input: any) => any;
    throws: (props: Pick<import("../..").TypeGuardError.IProps, "value" | "expected">) => never;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
export declare const snake: (method: string) => {
    any: (input: any) => any;
    throws: (props: Pick<import("../..").TypeGuardError.IProps, "value" | "expected">) => never;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
