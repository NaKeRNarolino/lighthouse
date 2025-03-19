import { BoolValue, NullValue, NumberValue } from "@lhs/runtime-values";

export class ValueMaker {
  static makeNull(): NullValue {
    return { type: "null", value: null };
  }

  static makeNumber(num = 0): NumberValue {
    return { type: "number", value: num };
  }

  static makeBool(b = true): BoolValue {
    return { type: "boolean", value: b };
  }
}
