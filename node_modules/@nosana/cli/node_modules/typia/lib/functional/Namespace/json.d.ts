export declare const stringify: (method: string) => {
    number: (value: number) => number;
    string: (str: string) => string;
    tail: (str: string) => string;
    rest: (str: string) => string;
    throws: (props: Pick<import("../..").TypeGuardError.IProps, "value" | "expected">) => never;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
