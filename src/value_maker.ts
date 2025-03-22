import {
  BooleanRuntimeValue,
  NullRuntimeValue,
  NumberRuntimeValue,
  StringRuntimeValue,
} from "@lhs/runtime-values";

export class ValueMaker {
  static makeNull(): NullRuntimeValue {
    return new NullRuntimeValue();
  }

  static makeNumber(num = 0): NumberRuntimeValue {
    return new NumberRuntimeValue(num);
  }

  static makeBool(b = true): BooleanRuntimeValue {
    return new BooleanRuntimeValue(b);
  }

  static makeString(str = ""): StringRuntimeValue {
    return new StringRuntimeValue(str);
  }
}
