export declare class TypeGuardError<T = any> extends Error {
    readonly method: string;
    readonly path: string | undefined;
    readonly expected: string;
    readonly value: any;
    protected readonly fake_expected_typed_value_?: T | undefined;
    constructor(props: TypeGuardError.IProps);
}
export declare namespace TypeGuardError {
    interface IProps {
        method: string;
        path?: undefined | string;
        expected: string;
        value: any;
        message?: undefined | string;
    }
}
