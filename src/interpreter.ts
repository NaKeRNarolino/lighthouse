import { RuntimeValue, NumberValue } from "./values.ts";
import { BinExpr, Identifier, NumericLiteral, Program, State, VarDeclaration } from "./ast.ts";
import Environment from "./environment.ts";
import { evaluateIdentifier, evaluateBinExpr } from "./eval/expressions.ts";
import { evaluateProgram, evaluateVarDec } from "./eval/statements.ts";


export function evaluate(astNode: State, env: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberValue;
        case "Identifier": 
            return evaluateIdentifier(astNode as Identifier, env);
        case "BinExpr":
            return evaluateBinExpr(astNode as BinExpr, env);   
        case "Program":
            return evaluateProgram(astNode as Program, env);
        case "VarDeclaration":
            return evaluateVarDec(astNode as VarDeclaration, env);

        default:
            console.error("Hui", astNode);
    }
}
