import {
  RuntimeValue,
  NumberRuntimeValue,
  StringRuntimeValue,
} from "@lhs/runtime-values";
import {
  BinExpr,
  Identifier,
  NumericLiteral,
  Program,
  State,
  StringLiteral,
  VarAssignment,
  VarDeclaration,
} from "@lhs/ast";
import Environment from "@lhs/environment";
import { evaluateIdentifier, evaluateBinExpr } from "@lhs/eval/expr";
import {
  evaluateProgram,
  evaluateVarAssignment,
  evaluateVarDec,
} from "@lhs/eval/stmt";
import { ValueMaker } from "@lhs/value-maker";

export function evaluate(
  astNode: State,
  env: Environment
): RuntimeValue<unknown> {
  switch (astNode.kind) {
    case "NumericLiteral":
      return new NumberRuntimeValue((astNode as NumericLiteral).value);
    case "StringLiteral":
      return new StringRuntimeValue((astNode as StringLiteral).value);
    case "Identifier":
      return evaluateIdentifier(astNode as Identifier, env);
    case "BinExpr":
      return evaluateBinExpr(astNode as BinExpr, env);
    case "Program":
      return evaluateProgram(astNode as Program, env);
    case "VarDeclaration":
      return evaluateVarDec(astNode as VarDeclaration, env);
    case "VarAssignment":
      return evaluateVarAssignment(astNode as VarAssignment, env);
    case "NullExpr":
      return ValueMaker.makeNull();

    default:
      console.error("Hui", astNode);
      return ValueMaker.makeNull();
  }
}
