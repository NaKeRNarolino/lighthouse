import Parser from "./src/parser.ts";
import { evaluate } from "./src/interpreter.ts";

repl();

function repl() {
    const parser = new Parser();

    console.log("\nRepl v0.1");

    while(true) {
        const input = prompt("> ");

        if(!input || input?.includes("exit")) {
            return;
        }

        const program = parser.produceAST(input);

        const result = evaluate(program);
        console.log(result);

        console.log("_______________________________________\n");
    }
}