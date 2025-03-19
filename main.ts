import Parser from "./src/parser.ts";
import { evaluate } from "./src/interpreter.ts";
import Environment from "./src/environment.ts";
import { MakeNull, MakeBool } from "./src/values.ts";

run();

function run() {
  const parser = new Parser();
  const env = new Environment();

  env.varDec("true", MakeBool(true), true);
  env.varDec("false", MakeBool(false), true);
  env.varDec("null", MakeNull(), true);

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
