import { RuntimeValue, NumberValue, MakeNull, MakeNumber } from "./values.ts";
import { BinExpr, Identifier, NumericLiteral, Program, State } from "./ast.ts";
import Environment from "./environment.ts";


function evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let lastEval: RuntimeValue = MakeNull();

    for(const state of program.body) {
        lastEval = evaluate(state, env);
    }

    return lastEval;
}

function evaluateNumBinExpr(lp: NumberValue, rp: NumberValue, op: string): NumberValue {
    let result: number;

    if(op == "+") {
        result = lp.value + rp.value;
    }
    else if(op == "-") {
        result = lp.value - rp.value;
    }
    else if(op == "*") {
        result = lp.value * rp.value;
    }
    else if(op == "/") {
        result = lp.value / rp.value;
    }

    return { value: result, type: "number" };
}

function evaluateBinExpr(binOp: BinExpr, env: Environment): RuntimeValue {
    const leftPart = evaluate(binOp.left, env);
    const rightPart = evaluate(binOp.right, env);

    if(leftPart.type == "number" && rightPart.type == "number") {
        return evaluateNumBinExpr(leftPart as NumberValue, rightPart as NumberValue, binOp.operator);
    }

    return MakeNull();
}

function evaluateIdentifier(id: Identifier, env: Environment): RuntimeValue {
    const val = env.lookUpVar(id.symbol);
    return val;
}

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

        default:
            console.error("Hui", astNode);
    }
}