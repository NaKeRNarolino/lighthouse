const keywordTypes = ["let", "const", "func"] as const;
export type Keyword = (typeof keywordTypes)[number];
const operatorTypes = ["+", "-", "/", "*", "%", "="] as const;
export type Operator = (typeof operatorTypes)[number];
const composedOperators = [
  "+=",
  "-=",
  "/=",
  "*=",
  "%=",
  "->",
  ">=",
  "<=",
] as const;
export type ComposedOperator = (typeof composedOperators)[number];

// export enum TokenType {
// Keyword,
// String,
// Identifier,
// DataTypeDec,
// DataType,
// Equals,
// Number,
// OpenPar,
// ClosePar,
// Operator,
// EndLine,
// EOF,
// Skip,
// }

export type TokenType =
  | "keyword"
  | "string"
  | "identifier"
  | "datatypeDec"
  | "datatype"
  | "equals"
  | "number"
  | "openPar"
  | "closePar"
  | "operator"
  | "endLine"
  | "eof"
  | "skip";

function toKeyword(kw: Keyword): Token<"keyword"> {
  return {
    value: kw,
    type: "keyword",
  };
}

const Keywords: Record<string, Token<"keyword">> =
  ((keywords: readonly Keyword[]) => {
    const result: Record<string, Token<"keyword">> = {};

    for (const kw of keywords) {
      result[kw] = toKeyword(kw);
    }

    return result;
  })(keywordTypes);

export type TokenValue<T> = T extends "keyword" ? Keyword
  : T extends "identifier" ? string
  : T extends "string" ? string
  : T extends "number" ? number
  : T extends "datatypeDec" ? string
  : T extends "datatype" ? string
  : T extends "equals" ? string
  : T extends "operator" ? Operator | ComposedOperator
  : T extends "endLine" ? string
  : T extends "eof" ? string
  : T extends "skip" ? string
  : T extends "openPar" ? string
  : T extends "closePar" ? string
  : never;

export type Token<T extends TokenType> = {
  value: TokenValue<T>;
  type: T;
};

export class TokenUtils {
  static is<T extends TokenType>(
    token: Token<T>,
    type: T,
    value: string,
  ): boolean {
    return token.type == type && token.value == value;
  }

  static isValueAny<T extends TokenType>(
    token: Token<T>,
    type: T,
    values: TokenValue<T>[],
  ): [boolean, TokenValue<T> | null] {
    // console.log(.value);
    if (token.type == type) {
      if (values.includes(token.value)) {
        return [true, token.value];
      }
    }
    return [false, null];
  }
}

const Operators: Record<string, Token<"operator">> =
  ((operators: readonly Operator[]) => {
    const result: Record<string, Token<"operator">> = {};

    for (const op of operators) {
      result[op] = toOperator(op);
    }

    return result;
  })(operatorTypes);

const ComposedOperators: Record<string, Token<"operator">> =
  ((operators: readonly ComposedOperator[]) => {
    const result: Record<string, Token<"operator">> = {};

    for (const op of operators) {
      result[op] = toOperator(op);
    }

    return result;
  })(composedOperators);

function toOperator(
  operator: Operator | ComposedOperator,
): Token<"operator"> {
  return {
    value: operator,
    type: "operator",
  };
}

function toToken<T extends TokenType>(value: TokenValue<T>, type: T): Token<T> {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isEmpty(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return c >= bounds[0] && c <= bounds[1];
}

// deno-lint-ignore no-explicit-any
export function tokenize(input: string): Token<any>[] {
  // deno-lint-ignore no-explicit-any
  const tokens = new Array<Token<any>>();
  const src = input.split("");

  let isMakingString = false;
  let stringMakingProcess = "";

  while (src.length > 0) {
    if (isEmpty(src[0])) {
      tokens.push(toToken(
        "",
        "skip" as const,
      ));
      src.shift();
      continue;
    }

    if (src[0] == "(") {
      tokens.push(toToken(src.shift()!, "openPar" as const));
    } else if (src[0] == ")") {
      tokens.push(toToken(src.shift()!, "closePar" as const));
    } else if (Operators[src[0]] != undefined) {
      if (tokens[tokens.length - 1]?.type != "skip") {
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
      tokens.push(toToken(src.shift()!, "datatypeDec" as const));
    } else if (src[0] == "=") {
      tokens.push(toToken(src.shift()!, "equals" as const));
    } else if (src[0] == ";") {
      tokens.push(toToken(src.shift()!, "endLine" as const));
    } else {
      if (src[0] == "\\" && src[1] == '"') {
        if (isMakingString) {
          stringMakingProcess += '"';
          src.shift();
          src.shift();
        }
      }

      if (src[0] == '"') {
        if (isMakingString) {
          tokens.push(toToken(stringMakingProcess, "string" as const));
        }
        stringMakingProcess = "";

        isMakingString = !isMakingString;

        src.shift();
        continue;
      }

      if (isMakingString) {
        const val = src.shift();

        stringMakingProcess = `${stringMakingProcess}${val}`;
        continue;
      }

      if (isInt(src[0])) {
        let num = "";

        while (src.length > 0 && isInt(src[0])) {
          num += src.shift();
        }

        tokens.push(toToken(parseFloat(num), "number" as const));
      } else if (isAlpha(src[0])) {
        let identifier = "";

        while (src.length > 0 && isAlpha(src[0])) {
          identifier += src.shift();
        }

        const reserved = Keywords[identifier];
        if (reserved != undefined) {
          tokens.push(reserved);
        } else {
          tokens.push(toToken(identifier, "identifier" as const));
        }
      } else {
        console.log("Unknown character: ", src[0]);
        Deno.exit();
      }
    }
  }

  tokens.push({ type: "eof", value: "EndOfFile" } as Token<"eof">);

  // console.log(tokens);
  return tokens.filter((v) => {
    return v.type != "skip";
  });
}
