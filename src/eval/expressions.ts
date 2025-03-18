import { BinExpr, Identifier } from "@lhs/ast";
import Environment from "@lhs/environment";
import { evaluate } from "@lhs/interpreter";
import { RuntimeValue, NumberValue } from "@lhs/runtime-values";
import { ValueMaker } from "@lhs/value-maker";

function evaluateNumBinExpr(
  lp: NumberValue,
  rp: NumberValue,
  op: string
): NumberValue {
  let result: number = 0;

  if (op == "+") {
    result = lp.value + rp.value;
  } else if (op == "-") {
    result = lp.value - rp.value;
  } else if (op == "*") {
    result = lp.value * rp.value;
  } else if (op == "/") {
    result = lp.value / rp.value;
  }

  return { value: result, type: "number" };
}

export function evaluateBinExpr(
  binOp: BinExpr,
  env: Environment
): RuntimeValue {
  const leftPart = evaluate(binOp.left, env);
  const rightPart = evaluate(binOp.right, env);

  if (leftPart.type == "number" && rightPart.type == "number") {
    return evaluateNumBinExpr(
      leftPart as NumberValue,
      rightPart as NumberValue,
      binOp.operator
    );
  }

  return ValueMaker.makeNull();
}

export function evaluateIdentifier(
  id: Identifier,
  env: Environment
): RuntimeValue {
  const val = env.lookUpVar(id.symbol);
  return val;
}
