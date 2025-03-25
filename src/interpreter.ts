import {
  RuntimeValue,
  NumberRuntimeValue,
  StringRuntimeValue,
} from "@lhs/runtime-values";
import {
  BinaryExpression,
  Identifier,
  NullExpression,
  NumericLiteral,
  Program,
  Statement,
  StringLiteral,
  VariableAssignment,
  VariableDeclaration,
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
  astNode: Statement,
  env: Environment
): RuntimeValue<unknown> {
  if (astNode instanceof NumericLiteral) {
    return new NumberRuntimeValue(astNode.value);
  } else if (astNode instanceof StringLiteral) {
    return new StringRuntimeValue(astNode.value);
  } else if (astNode instanceof Identifier) {
    return evaluateIdentifier(astNode, env);
  } else if (astNode instanceof BinaryExpression) {
    return evaluateBinExpr(astNode, env);
  } else if (astNode instanceof Program) {
    return evaluateProgram(astNode, env);
  } else if (astNode instanceof VariableDeclaration) {
    return evaluateVarDec(astNode, env);
  } else if (astNode instanceof VariableAssignment) {
    return evaluateVarAssignment(astNode, env);
  } else if (astNode instanceof NullExpression) {
    return ValueMaker.makeNull();
  } else {
    console.error("Unknown AST Node: ", astNode);
    return ValueMaker.makeNull();
  }
}
