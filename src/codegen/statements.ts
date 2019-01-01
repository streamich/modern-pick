import {Expression} from './expressions';

export type AnyStatement = Statement | BlockStatement | IfStatement | ReturnStatement;
export type AnyStatementOrExpression = AnyStatement | Expression;

export class Statement {
  expressions: AnyStatementOrExpression[];

  constructor (expressions: AnyStatementOrExpression[]) {
    this.expressions = expressions;
  }

  toString () {
    if (!this.expressions.length) return '';
    let str = '';
    for (const item of this.expressions) {
      if (item instanceof Expression) {
        str += item + ';';
      } else {
        str += item;
      }
    }
    return str;
  }
}

export class BlockStatement extends Statement {
  toString () {
    return `{${super.toString()}}`;
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
    return `if(${this.test})${this.block}` + (this.elseBlock ? `else${this.elseBlock}` : '');
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

export class DeclarationStatement {
  expr: Expression;
  type: 'const' | 'let' | 'var';

  constructor (expr: Expression, type: 'const' | 'let' | 'var') {
    this.expr = expr;
    this.type = type;
  }

  toString () {
    return `${this.type} ${this.expr};`;
  }
}

export const st = (...expressions: Expression[]) => new Statement(expressions);
export const block = (...expressions: AnyStatementOrExpression[]) => new BlockStatement(expressions);
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
export const decl = (expression: Expression, type: 'const' | 'let' | 'var' = 'let') =>
  new DeclarationStatement(expression, type);
