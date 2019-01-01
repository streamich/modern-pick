import {BlockStatement, AnyStatementOrExpression, block} from './statements';
import {Expression} from './expressions';

export class Function {
  args: Expression;
  body: BlockStatement;
  isAsync: boolean;

  constructor(args: Expression, body: BlockStatement, isAsync?: boolean) {
    this.args = args;
    this.body = body;
    this.isAsync = !!isAsync;
  }

  toString() {
    return `${this.isAsync ? 'async ' : ''}function(${this.args})${this.body}`;
  }
}

export class ArrowFunction {
  args: Expression;
  body: BlockStatement;
  isAsync: boolean;

  constructor(args: Expression, body: BlockStatement, isAsync?: boolean) {
    this.args = args;
    this.body = body;
    this.isAsync = !!isAsync;
  }

  toString() {
    return `${this.isAsync ? 'async' : ''}(${this.args})=>${this.body}`;
  }
}

export const fn = (args: Expression, body: AnyStatementOrExpression[] | BlockStatement, isAsync?: boolean) => {
  if (Array.isArray(body)) {
    body = block(...body);
  }
  // tslint:disable-next-line
  return new Function(args, body, isAsync);
};
export const arr = (args: Expression, body: AnyStatementOrExpression[] | BlockStatement, isAsync?: boolean) => {
  if (Array.isArray(body)) {
    body = block(...body);
  }
  return new ArrowFunction(args, body, isAsync);
};
