export enum TokenType {
  VarDec,
  FuncDec,
  Identifier,

  DataTypeDec,
  DataType,

  Equals,

  Number,
  Null,

  OpenPar,
  ClosePar,

  BinOp,

  EndLine,

  EOF
}

const Keywords: Record<string, TokenType> =  {
  let: TokenType.VarDec,
  func: TokenType.FuncDec,
  null: TokenType.Null
};

export interface Token {
  value: string,
  type: TokenType
}


function toToken(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toUpperCase() != src.toLowerCase();
}

function isEmpty(str: string) {
  return str == ' ' || str == '\n' || str == '\t';
}

function isInt(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

  return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize(input: string): Token[] {

  const tokens = new Array<Token>();
  const src = input.split("");

  while(src.length > 0) {

      if(src[0] == '(') {
          tokens.push(toToken(src.shift(), TokenType.OpenPar));
      }
      else if(src[0] == ')') {
          tokens.push(toToken(src.shift(), TokenType.ClosePar));
      }
      else if(src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/') {
          tokens.push(toToken(src.shift(), TokenType.BinOp));
      }
      else if(src[0] == ':') {
        tokens.push(toToken(src.shift(), TokenType.DataTypeDec));
      }
      else if(src[0] == '=') {
          tokens.push(toToken(src.shift(), TokenType.Equals));
      }
      else if(src[0] == ';') {
        tokens.push(toToken(src.shift(), TokenType.EndLine));
      }
      else {
          if(isInt(src[0])) {
              let num = "";

              while(src.length > 0 && isInt(src[0])) {
                  num += src.shift();
              }
              
              tokens.push(toToken(num, TokenType.Number));
          }
          else if(isAlpha(src[0])) {
              let identifier = "";

              while(src.length > 0 && isAlpha(src[0])) {
                  identifier += src.shift();
              }

              const reserved = Keywords[identifier];
              if(typeof reserved == "number") {
                  tokens.push(toToken(identifier, reserved));
              }
              else {
                  tokens.push(toToken(identifier, TokenType.Identifier));
              }
          }
          else if(isEmpty(src[0])) {
              src.shift();
          }
          else {
              console.log('Unknown character: ', src[0]);
          }
      }
  }

  tokens.push({type: TokenType.EOF, value: "EndOfFile"});
  return tokens;
}