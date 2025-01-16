import { $FormDataReader } from "../$FormDataReader";
import { $HeadersReader } from "../$HeadersReader";
import { $ParameterReader } from "../$ParameterReader";
import { $QueryReader } from "../$QueryReader";
export declare const formData: () => typeof $FormDataReader;
export declare const headers: () => typeof $HeadersReader;
export declare const parameter: () => typeof $ParameterReader;
export declare const query: () => typeof $QueryReader;
