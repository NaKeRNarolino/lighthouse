import { Program, VarDeclaration } from "../ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeValue, MakeNull } from "../values.ts";


export function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEval: RuntimeValue = MakeNull();

    for(const state of program.body) {
        lastEval = evaluate(state, env);
    }

    return lastEval;
}

export function evaluateVarDec(declaration: VarDeclaration, env: Environment): RuntimeValue {
    const value = declaration.value ? evaluate(declaration.value, env) : MakeNull();
    return env.varDec(declaration.identifier, value, declaration.constant);
}
