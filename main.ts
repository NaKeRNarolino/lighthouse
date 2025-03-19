import Parser from "./src/parser.ts";
import { evaluate } from "./src/interpreter.ts";
import Environment from "./src/environment.ts";
import { MakeNull, MakeNumber, MakeBool } from "./src/values.ts";

repl();

function repl() {
  const parser = new Parser();
  const env = new Environment();
  env.varDec("myVar", MakeNumber(100));
  env.varDec("true", MakeBool(true));
  env.varDec("false", MakeBool(false));
  env.varDec("null", MakeNull());

  console.log("\nLighthouse v0.1");

  while (true) {
    const input = prompt("> ");

    if (!input || input?.includes("exit")) {
      return;
    }

    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);

    console.log("_______________________________________\n");
  }
}
