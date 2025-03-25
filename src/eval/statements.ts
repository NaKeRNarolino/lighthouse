import { Program, VariableAssignment, VariableDeclaration } from "@lhs/ast";
import Environment from "@lhs/environment";
import { evaluate } from "@lhs/interpreter";
import { RuntimeValue } from "@lhs/runtime-values";
import { ValueMaker } from "@lhs/value-maker";

export function evaluateProgram(
  program: Program,
  env: Environment
): RuntimeValue<unknown> {
  let lastEval: RuntimeValue<unknown> = ValueMaker.makeNull();

  for (const state of program.body) {
    lastEval = evaluate(state, env);
  }

  return lastEval;
}

export function evaluateVarDec(
  declaration: VariableDeclaration,
  env: Environment
): RuntimeValue<unknown> {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : ValueMaker.makeNull();
  return env.varDec(declaration.identifier, value, declaration.isConstant);
}

export function evaluateVarAssignment(
  stmt: VariableAssignment,
  env: Environment
): RuntimeValue<unknown> {
  env.varAssign(stmt.identifier, evaluate(stmt.value, env));

  return ValueMaker.makeNull();
}
