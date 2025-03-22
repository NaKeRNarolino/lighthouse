import {
  Program,
  State,
  VarDeclaration,
  Expr,
  BinExpr,
  Identifier,
  NumericLiteral,
  VarAssignment,
  NullExpr,
  StringLiteral,
} from "@lhs/ast";
import { Token, TokenType, tokenize, TokenUtils } from "@lhs/lexer";

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

    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parseState());
    }

    return program;
  }

  private parseState(): State {
    switch (this.atToken().type) {
      case TokenType.Keyword: {
        if (this.atToken().value == "let" || this.atToken().value == "const") {
          return this.parseVarDec();
        }
        return { kind: "NullExpr" } satisfies NullExpr;
      }
      case TokenType.EndLine:
        return {
          kind: "NullExpr",
        } satisfies NullExpr;
      default:
        return this.parseExpr();
    }
  }

  private parseVarDec(): State {
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

      return {
        kind: "VarDeclaration",
        identifier: id,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(TokenType.Operator, "Expected '=' operator", "=");

    const declaration = {
      kind: "VarDeclaration",
      value: this.parseExpr(),
      identifier: id,
      constant: isConstant,
    } as VarDeclaration;

    this.expect(TokenType.EndLine, "Expected a semicolon");

    return declaration;
  }

  private parseExpr(): Expr {
    return this.parseAddExpr();
  }

  private parseAddExpr(): Expr {
    let left = this.parseMultExpr();

    while (this.atToken().value == "+" || this.atToken().value == "-") {
      const operator = this.eat().value;
      const right = this.parseMultExpr();
      left = {
        kind: "BinExpr",
        left,
        right,
        operator,
      } as BinExpr;
    }

    return left;
  }

  private parseMultExpr(): Expr {
    let left = this.parseModExpr();

    while (this.atToken().value == "*" || this.atToken().value == "/") {
      const operator = this.eat().value;
      const right = this.parseModExpr();
      left = {
        kind: "BinExpr",
        left,
        right,
        operator,
      } as BinExpr;
    }

    return left;
  }

  private parseModExpr(): Expr {
    let left = this.parsePrimExpr();

    while (this.atToken().value == "%") {
      const operator = this.eat().value;
      const right = this.parsePrimExpr();
      left = {
        kind: "BinExpr",
        left,
        right,
        operator,
      } as BinExpr;
    }

    return left;
  }

  private parsePrimExpr(): Expr {
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

        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      }
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      case TokenType.String:
        return {
          kind: "StringLiteral",
          value: this.eat().value,
        } as StringLiteral;
      case TokenType.OpenPar: {
        this.eat();
        const value = this.parseExpr();
        this.expect(TokenType.ClosePar, "')' expected.");
        return value;
      }

      default:
        console.error("Unexpected token: ", this.atToken());
        Deno.exit();
      // return {} as State;
    }
  }

  private parseVarAssignment(mode: string): Expr {
    const ident = this.eat();
    this.eat(); // `=` | `+=` | `-=` | `/=` | `*=`

    const expr = this.parseExpr();

    const v: VarAssignment = {
      ident: ident.value,
      value: (() => {
        if (mode == "=") {
          return expr;
        } else if (mode == "+=") {
          return {
            kind: "BinExpr",
            left: {
              kind: "Identifier",
              symbol: ident.value,
            } satisfies Identifier as Expr,
            right: expr,
            operator: "+",
          } satisfies BinExpr;
        } else if (mode == "-=") {
          return {
            kind: "BinExpr",
            left: {
              kind: "Identifier",
              symbol: ident.value,
            } satisfies Identifier as Expr,
            right: expr,
            operator: "-",
          } satisfies BinExpr;
        } else if (mode == "/=") {
          return {
            kind: "BinExpr",
            left: {
              kind: "Identifier",
              symbol: ident.value,
            } satisfies Identifier as Expr,
            right: expr,
            operator: "/",
          } satisfies BinExpr;
        } else if (mode == "*=") {
          return {
            kind: "BinExpr",
            left: {
              kind: "Identifier",
              symbol: ident.value,
            } satisfies Identifier as Expr,
            right: expr,
            operator: "*",
          } satisfies BinExpr;
        } else if (mode == "%=") {
          return {
            kind: "BinExpr",
            left: {
              kind: "Identifier",
              symbol: ident.value,
            } satisfies Identifier as Expr,
            right: expr,
            operator: "%",
          } satisfies BinExpr;
        }
        return { kind: "NullExpr" } satisfies NullExpr;
      })(),
      kind: "VarAssignment",
    };

    this.expect(TokenType.EndLine, "Expected a semicolon");

    return v;
  }
}
