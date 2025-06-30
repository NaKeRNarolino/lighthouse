import {
  Program,
  Identifier,
  NumericLiteral,
  NullExpression,
  StringLiteral,
  Statement,
  VariableDeclaration,
  Expression,
  BinaryExpression,
  Operand,
  VariableAssignment,
} from "@lhs/ast";
import { Token, TokenType, tokenize, TokenUtils } from "@lhs/lexer";

const operatorToOperand = (operator: string) => {
  switch (operator) {
    case "+":
      return Operand.Plus;
    case "-":
      return Operand.Minus;
    case "/":
      return Operand.Division;
    case "*":
      return Operand.Multiplication;
    case "%":
      return Operand.Modulo;
    default:
      console.error("Unknown operator: ", operator);
      Deno.exit(0);
  }
};

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private atToken() {
    return this.tokens[0] as Token;
  }

  private peek(i: number = 1) {
    return this.tokens[i];
  }

  private eat() {
    const prev = this.tokens.shift() as Token;

    return prev;
  }

  private expect(
    type: TokenType,
    // deno-lint-ignore no-explicit-any
    message: any,
    value?: number | string | boolean
  ) {
    const prev = this.tokens.shift() as Token;

    if (!prev || prev.type != type) {
      if (value && prev.value != value) {
        console.error("Parser error:\n", message, prev);
        return prev;
      }
      console.error("Parser error:\n", message, prev);
    }

    return prev;
  }

  public produceAST(src: string): Program {
    this.tokens = tokenize(src);

    const program: Program = new Program([]);

    while (this.not_eof()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    switch (this.atToken().type) {
      case TokenType.Keyword: {
        if (this.atToken().value == "let" || this.atToken().value == "const") {
          return this.parseVarDec();
        }
        return new NullExpression();
      }
      case TokenType.EndLine:
        return new NullExpression();
      default:
        return this.parseExpr();
    }
  }

  private parseVarDec(): Statement {
    const isConstant = this.eat().value == "const";
    const id = this.expect(
      TokenType.Identifier,
      "Expected an identifier as a name"
    ).value;

    if (this.atToken().type == TokenType.EndLine) {
      this.eat();

      if (isConstant) {
        throw "Must assign a value";
      }

      return new VariableDeclaration(isConstant, id);
    }

    this.expect(TokenType.Operator, "Expected '=' operator", "=");

    const declaration = new VariableDeclaration(
      isConstant,
      id,
      this.parseExpr()
    );

    this.expect(TokenType.EndLine, "Expected a semicolon");

    return declaration;
  }

  private parseExpr(): Expression {
    return this.parseAddExpr();
  }

  private parseAddExpr(): Expression {
    let left = this.parseMultExpr();

    while (this.atToken().value == "+" || this.atToken().value == "-") {
      const operator = this.eat().value;
      const right = this.parseMultExpr();
      left = new BinaryExpression(left, right, operatorToOperand(operator));
    }

    return left;
  }

  private parseMultExpr(): Expression {
    let left = this.parseModExpr();

    while (this.atToken().value == "*" || this.atToken().value == "/") {
      const operator = this.eat().value;
      const right = this.parseModExpr();
      left = new BinaryExpression(left, right, operatorToOperand(operator));
    }

    return left;
  }

  private parseModExpr(): Expression {
    let left = this.parsePrimExpr();

    while (this.atToken().value == "%") {
      const operator = this.eat().value;
      const right = this.parsePrimExpr();
      left = new BinaryExpression(left, right, operatorToOperand(operator));
    }

    return left;
  }

  private parsePrimExpr(): Expression {
    const token = this.atToken().type;

    switch (token) {
      case TokenType.Identifier: {
        const tryGetAssignment = TokenUtils.isValueAny(
          this.peek(),
          TokenType.Operator,
          ["=", "+=", "-=", "/=", "*=", "%="]
        );
        // console.log(JSON.stringify(tryGetAssignment));
        if (tryGetAssignment[0]) {
          return this.parseVarAssignment(tryGetAssignment[1]!);
        }

        return new Identifier(this.eat().value);
      }
      case TokenType.Number:
        return new NumericLiteral(parseFloat(this.eat().value));
      case TokenType.String:
        return new StringLiteral(this.eat().value);
      case TokenType.OpenPar: {
        this.eat();
        const value = this.parseExpr();
        this.expect(TokenType.ClosePar, "')' expected.");
        return value;
      }

      default:
        console.error("Unexpected token: ", this.atToken());
        Deno.exit();
      // return {} as Statement;
    }
  }

  private parseVarAssignment(mode: string): Expression {
    const ident = this.eat();
    this.eat(); // `=` | `+=` | `-=` | `/=` | `*=`

    const expr = this.parseExpr();

    const v: VariableAssignment = new VariableAssignment(
      ident.value,
      (() => {
        if (mode == "=") {
          return expr;
        } else {
          const modeModifier = mode[0];
          const operand = operatorToOperand(modeModifier);

          return new BinaryExpression(
            new Identifier(ident.value),
            expr,
            operand
          );
        }
      })()
    );

    this.expect(TokenType.EndLine, "Expected a semicolon");

    return v;
  }
}
