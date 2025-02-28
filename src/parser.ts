import { State, Program, Expr, BinExpr, NumericLiteral, Identifier } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";


export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private atToken() {
        return this.tokens[0] as Token;
    }

    private eat() {
        const prev = this.tokens.shift() as Token;

        return prev;
    }

    private expect(type: TokenType, message: any) {
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type != type) {
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

        while(this.not_eof()) {
            program.body.push(this.parseState());
        }

        return program;
    }

    private parseState(): State {
        return this.parseExpr();
    }
    
    private parseExpr(): Expr {
        return this.parseAddExpr();
    }

    private parseAddExpr(): Expr {
        let left = this.parseMultExpr();

        while(this.atToken().value == "+" || this.atToken().value == "-") {
            const operator = this.eat().value;
            const right = this.parseMultExpr();
            left = {
                kind: "BinExpr",
                left, 
                right, 
                operator
            } as BinExpr;
        }

        return left;
    }

    private parseMultExpr(): Expr {
        let left = this.parsePrimExpr();

        while(this.atToken().value == "*" || this.atToken().value == "/") {
            const operator = this.eat().value;
            const right = this.parsePrimExpr();
            left = {
                kind: "BinExpr",
                left, 
                right, 
                operator
            } as BinExpr;
        }

        return left;
    }

    private parsePrimExpr(): Expr {
        const token = this.atToken().type;
        
        switch(token) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
            case TokenType.OpenPar: 
                this.eat();
                const value = this.parseExpr();
                this.expect(TokenType.ClosePar, "')' expected.");
                return value;

            default:
                console.error("Unexpected token: ", this.atToken());
                return {} as State;
        }
    }
}