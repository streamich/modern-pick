import {BlockStatement} from "./statements";
import {Expression} from "./expressions";

export class ArrowFunction {
  args: Expression;
  body: BlockStatement;
  isAsync: boolean;

  constructor (args: Expression, body: BlockStatement, isAsync?: boolean) {
    this.args = args;
    this.body = body;
    this.isAsync = !!isAsync;
  }

  toString () {
    return `(${this.args})=>${this.body}`;
  }
}

export const fn = (args: Expression, body: BlockStatement, isAsync?: boolean) => {

  return new ArrowFunction(args, body, isAsync);
};
