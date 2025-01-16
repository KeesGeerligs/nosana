import type { HttpLlm } from "../HttpLlm";
import { IHttpResponse } from "../structures/IHttpResponse";
export declare namespace HttpLlmFunctionFetcher {
    const execute: (props: HttpLlm.IFetchProps) => Promise<unknown>;
    const propagate: (props: HttpLlm.IFetchProps) => Promise<IHttpResponse>;
}
