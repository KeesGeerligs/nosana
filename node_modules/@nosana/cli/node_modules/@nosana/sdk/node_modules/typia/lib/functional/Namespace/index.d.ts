import { RandomGenerator } from "../../utils/RandomGenerator";
import { IValidation } from "../../IValidation";
import { TypeGuardError } from "../../TypeGuardError";
import { is } from "../is";
export * as functional from "./functional";
export * as json from "./json";
export * as http from "./http";
export * as notations from "./notations";
export * as misc from "./misc";
export * as protobuf from "./protobuf";
export * as llm from "./llm";
export { is };
export declare const assert: (method: string) => {
    join: (str: string) => string;
    every: <T>(array: T[], pred: (value: T, i: number) => null | Omit<TypeGuardError.IProps, "method">) => null | Omit<TypeGuardError.IProps, "method">;
    guard: (exceptionable: boolean, props: Omit<TypeGuardError.IProps, "method">, factory?: (props: TypeGuardError.IProps) => Error) => boolean;
    predicate: (matched: boolean, exceptionable: boolean, closure: () => Omit<TypeGuardError.IProps, "method">) => boolean;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
export declare const validate: () => {
    join: (str: string) => string;
    report: (array: IValidation.IError[]) => (exceptable: boolean, error: IValidation.IError) => false;
    predicate: (res: IValidation) => (matched: boolean, exceptionable: boolean, closure: () => IValidation.IError) => boolean;
    is_between: (value: number, minimum: number, maximum: number) => boolean;
    is_bigint_string: (str: string) => boolean;
};
export declare const random: () => {
    generator: typeof RandomGenerator;
    pick: <T>(array: T[]) => T;
};
