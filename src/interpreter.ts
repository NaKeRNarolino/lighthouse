import { RuntimeValue, NumberValue } from "@lhs/runtime-values";
import {
  BinExpr,
  Identifier,
  NumericLiteral,
  Program,
  State,
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

export function evaluate(astNode: State, env: Environment): RuntimeValue {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number",
      } as NumberValue;
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
