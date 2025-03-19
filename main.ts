import Parser from "@lhs/parser";
import { evaluate } from "@lhs/interpreter";
import Environment from "@lhs/environment";
import { ValueMaker } from "@lhs/value-maker";

repl();

function repl() {
  const parser = new Parser();
  const env = new Environment();
  //   env.varDec("myVar", ValueMaker.makeNumber(100), false);
  env.varDec("true", ValueMaker.makeBool(true), false);
  env.varDec("false", ValueMaker.makeBool(false), false);
  env.varDec("null", ValueMaker.makeNull(), false);

  console.log("\nLighthouse v0.1");

  while (true) {
    const input = prompt("> ");

    if (!input || input?.trim() == "exit") {
      return;
    }

    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);

    console.log("_______________________________________\n");
  }
}
