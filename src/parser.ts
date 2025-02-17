import { State, Program, Expr, BinExpr, NumericLiteral, Identifier } from "./ast";
import { tokenize, Token, TokenType } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    public produceAST(src: string): Program {

        this.tokens = tokenize(src);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while(this.not_eof()) {
            
        }

        return program;
    }
}