import { BinExpr, Identifier } from "../ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeValue, MakeNull, NumberValue } from "../values.ts";


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


export function evaluateBinExpr(binOp: BinExpr, env: Environment): RuntimeValue {
    const leftPart = evaluate(binOp.left, env);
    const rightPart = evaluate(binOp.right, env);

    if(leftPart.type == "number" && rightPart.type == "number") {
        return evaluateNumBinExpr(leftPart as NumberValue, rightPart as NumberValue, binOp.operator);
    }

    return MakeNull();
}

export function evaluateIdentifier(id: Identifier, env: Environment): RuntimeValue {
    const val = env.lookUpVar(id.symbol);
    return val;
}
