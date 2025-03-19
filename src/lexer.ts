export enum TokenType {
  Keyword,

  Identifier,

  DataTypeDec,
  DataType,

  Equals,

  Number,

  OpenPar,
  ClosePar,

  Operator,

  EndLine,

  EOF,
  Skip,
}

function toKeyword(kw: string): Token {
  return {
    value: kw,
    type: TokenType.Keyword,
  };
}

const Keywords: Record<string, Token> = ((keywords: string[]) => {
  const result: Record<string, Token> = {};

  for (const kw of keywords) {
    result[kw] = toKeyword(kw);
  }

  return result;
})(["let", "const", "func"]);

export interface Token {
  value: string;
  type: TokenType;
}

export class TokenUtils {
  static is(token: Token, type: TokenType, value: string): boolean {
    return token.type == type && token.value == value;
  }

  static isValueAny(
    token: Token,
    type: TokenType,
    values: string[]
  ): [boolean, string | null] {
    // console.log(token.value);
    if (token.type == type) {
      if (values.includes(token.value)) {
        return [true, token.value];
      }
    }
    return [false, null];
  }
}

const Operators: Record<string, Token> = ((operators: string[]) => {
  const result: Record<string, Token> = {};

  for (const op of operators) {
    result[op] = toOperator(op);
  }

  return result;
})(["+", "-", "/", "*", "%", "="]);

const ComposedOperators: Record<string, Token> = ((operators: string[]) => {
  const result: Record<string, Token> = {};

  for (const op of operators) {
    result[op] = toOperator(op);
  }

  return result;
})(["+=", "-=", "/=", "*="]);

function toOperator(operator: string): Token {
  return {
    value: operator,
    type: TokenType.Operator,
  };
}

function toToken(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isEmpty(str: string) {
  return str == " " || str == "\n" || str == "\t";
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(input: string): Token[] {
  const tokens = new Array<Token>();
  const src = input.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(toToken(src.shift(), TokenType.OpenPar));
    } else if (src[0] == ")") {
      tokens.push(toToken(src.shift(), TokenType.ClosePar));
    } else if (Operators[src[0]] != undefined) {
      if (tokens[tokens.length - 1]?.type != TokenType.Skip) {
        const composed = tokens[tokens.length - 1].value + src[0];

        if (ComposedOperators[composed] != undefined) {
          tokens.pop();
          tokens.push(ComposedOperators[composed]);
          src.shift();
          continue;
        }
      }
      tokens.push(Operators[src.shift()!]);
    } else if (src[0] == ":") {
      tokens.push(toToken(src.shift(), TokenType.DataTypeDec));
    } else if (src[0] == "=") {
      tokens.push(toToken(src.shift(), TokenType.Equals));
    } else if (src[0] == ";") {
      tokens.push(toToken(src.shift(), TokenType.EndLine));
    } else {
      if (isInt(src[0])) {
        let num = "";

        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        tokens.push(toToken(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let identifier = "";

        while (src.length > 0 && isAlpha(src[0])) {
          identifier += src.shift();
        }

        const reserved = Keywords[identifier];
        if (reserved != undefined) {
          tokens.push(reserved);
        } else {
          tokens.push(toToken(identifier, TokenType.Identifier));
        }
      } else if (isEmpty(src[0])) {
        tokens.push({
          type: TokenType.Skip,
          value: "",
        });
        src.shift();
      } else {
        console.log("Unknown character: ", src[0]);
      }
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });

  // console.log(tokens);
  return tokens.filter((v) => {
    return v.type != TokenType.Skip;
  });
}
