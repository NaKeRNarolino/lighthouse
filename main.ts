import Parser from "./src/parser.ts";

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
        console.log(program);
    }
}