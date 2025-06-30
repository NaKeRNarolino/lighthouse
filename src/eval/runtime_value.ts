// export type ValueType = "null" | "number" | "boolean";

export abstract class RuntimeValue<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class NullRuntimeValue extends RuntimeValue<null> {
  constructor() {
    super(null);
  }
}

export class NumberRuntimeValue extends RuntimeValue<number> {}

export class BooleanRuntimeValue extends RuntimeValue<boolean> {}

export class StringRuntimeValue extends RuntimeValue<string> {}

// export interface NullValue extends RuntimeValue {
//   type: "null";
//   value: null;
// }

// export interface NumberValue extends RuntimeValue {
//   type: "number";
//   value: number;
// }

// export interface BoolValue extends RuntimeValue {
//   type: "boolean";
//   value: boolean;
// }
