import { Program, VarAssignment, VarDeclaration } from "@lhs/ast";
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
  declaration: VarDeclaration,
  env: Environment
): RuntimeValue<unknown> {
  const value = declaration.value
    ? evaluate(declaration.value, env)
    : ValueMaker.makeNull();
  return env.varDec(declaration.identifier, value, declaration.constant);
}

export function evaluateVarAssignment(
  stmt: VarAssignment,
  env: Environment
): RuntimeValue<unknown> {
  env.varAssign(stmt.ident, evaluate(stmt.value, env));

  return ValueMaker.makeNull();
}
