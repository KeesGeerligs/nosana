import type { TagBase } from "./TagBase";
import type { FormatCheatSheet } from "./internal/FormatCheatSheet";
export type Format<Value extends keyof Format.Validator> = TagBase<{
    target: "string";
    kind: "format";
    value: Value;
    validate: Format.Validator[Value];
    exclusive: ["format", "pattern"];
    schema: {
        format: Value;
    };
}>;
export declare namespace Format {
    type Validator = typeof FormatCheatSheet;
}
