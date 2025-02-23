import { RuntimeValue, NumberValue, NullValue } from "./values.ts";
import { BinExpr, NumericLiteral, Program, State } from "./ast.ts";


function evaluateProgram(program: Program): RuntimeValue {
    let lastEval: RuntimeValue = { type: "null", value: "null" } as NullValue;

    for(const state of program.body) {
        lastEval = evaluate(state);
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

function evaluateBinExpr(binOp: BinExpr): RuntimeValue {
    const leftPart = evaluate(binOp.left);
    const rightPart = evaluate(binOp.right);

    if(leftPart.type == "number" && rightPart.type == "number") {
        return evaluateNumBinExpr(leftPart as NumberValue, rightPart as NumberValue, binOp.operator);
    }

    return { type: "null", value: "null" } as NullValue;
}


export function evaluate(astNode: State): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberValue;
        case "Null":
            return { value: "null", type: "null" } as NullValue;
        case "BinExpr":
            return evaluateBinExpr(astNode as BinExpr);   
        case "Program":
            return evaluateProgram(astNode as Program);

        default:
            console.error("Hui", astNode)
    }
}