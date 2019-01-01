import {Expression} from './expressions';

export class Statement {
  expressions: Expression[];

  constructor (expressions: Expression[]) {
    this.expressions = expressions;
  }

  toString () {
    if (!this.expressions.length) return '';
    return this.expressions.map(expr => '' + expr).join(';') + ';';
  }
}

export class BlockStatement extends Statement {
  toString () {
    if (!this.expressions.length) return '{}';
    return this.expressions.length > 1
      ? `{${super.toString()}}`
      : super.toString();
  }
}

export class IfStatement {
  test: Expression;
  block: BlockStatement;
  elseBlock: BlockStatement | undefined;

  constructor (test: Expression, block: BlockStatement, elseBlock: BlockStatement | undefined) {
    this.test = test;
    this.block = block;
    this.elseBlock = elseBlock;
  }

  toString () {
    return `if(${this.test})${this.block}` + (this.elseBlock ? `else ${this.elseBlock}` : '');
  }
}

export class ReturnStatement {
  expr: Expression;

  constructor (expr: Expression) {
    this.expr = expr;
  }

  toString () {
    return `return ${this.expr};`;
  }
}

export const st = (...expressions: Expression[]) => new Statement(expressions);
export const block = (...expressions: Expression[]) => new BlockStatement(expressions);
export const fi = (test: Expression, ifBlock: Expression | Expression[] | BlockStatement, elseBlock?: Expression | Expression[] | BlockStatement) => {
  if (ifBlock instanceof Expression) {
    ifBlock = block(ifBlock);
  } else if (Array.isArray(ifBlock)) {
    ifBlock = block(...ifBlock);
  }
  if (elseBlock) {
    if (elseBlock instanceof Expression) {
      elseBlock = block(elseBlock);
    } else if (Array.isArray(elseBlock)) {
      elseBlock = block(...elseBlock);
    }
  }
  return new IfStatement(test, ifBlock, elseBlock);
};
export const ret = (expression: Expression) => new ReturnStatement(expression);
