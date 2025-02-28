export type ValueType = "null" | "number" | "boolean";

export interface RuntimeValue {
    type: ValueType;
}

export interface NullValue extends RuntimeValue {
    type: "null";
    value: null;
}

export function MakeNull() {
    return { type: "null", value: null } as NullValue;
}


export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
}

export function MakeNumber(num = 0) {
    return { type: "number", value: num } as NumberValue;
}


export interface BoolValue extends RuntimeValue {
    type: "boolean";
    value: boolean;
}

export function MakeBool(b = true) {
    return { type: "boolean", value: b } as BoolValue;
}