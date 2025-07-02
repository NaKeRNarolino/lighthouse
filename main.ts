import Parser from "@lhs/parser";
import { evaluate } from "@lhs/interpreter";
import Environment from "@lhs/environment";
import { ValueMaker } from "@lhs/value-maker";

lhs();

async function lhs() {
  const parser = new Parser();
  const env = new Environment();
  env.declareVariable({
    name: "true", 
    value: ValueMaker.makeBool(true), 
    isConstant: true
  });

  env.declareVariable({
    name: "false", 
    value: ValueMaker.makeBool(false), 
    isConstant: true
  });
  env.declareVariable({
    name: "null", 
    value: ValueMaker.makeNull(), isConstant: true
  });

  console.log("\nLighthouse v0.1.1\n");

  const useConsole = Deno.args[0] == "console";

  if (useConsole) {
    while (true) {
      const input = prompt("LHS> ")?.trim();

      if (input == undefined || input.includes("TERMINATE")) {
        Deno.exit(1);
      }

      const program = parser.produceAST(input);

      const res = evaluate(program, env);

      console.log(res);
    }
  } else {
    const input = await Deno.readTextFile("./files/test.lgs");

    // console.log(input);

    const program = parser.produceAST(input);

    const result = evaluate(program, env);
    console.log(result);

    console.log("_______________________________________\n");
    Deno.exit(1);
  }
}
