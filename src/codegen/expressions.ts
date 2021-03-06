export type Operand = number | string | Expression;
export type OperandOrOperator = number | string | Expression;

export class Expression {
  // List operands and operators together, in correct order.
  opops: OperandOrOperator[];
  // Whether oprators start before operands, e.g. "++i".
  prefixOperator: boolean;
  // Whether not to wrap operands into parens.
  noParens: boolean;

  constructor(opops: OperandOrOperator[], prefixOperator?: boolean, noParens?: boolean) {
    this.opops = opops;
    this.prefixOperator = !!prefixOperator;
    this.noParens = !!noParens;
  }

  toString() {
    if (this.opops.length === 1) return String(this.opops[0]);
    const {prefixOperator, noParens} = this;
    return this.opops.reduce((acc, op, i) => {
      const isOperand = prefixOperator ? !!(i % 2) : !(i % 2);
      const isExpression = op instanceof Expression;
      const evaluated = String(op);
      return !noParens && isOperand && isExpression ? acc + '(' + evaluated + ')' : acc + evaluated;
    }, '');
  }
}

export const expr = (...opops: OperandOrOperator[]) => new Expression(opops, false, false);
export const exprPrefix = (...opops: OperandOrOperator[]) => new Expression(opops, true, false);
export const e = expr;
export const ep = exprPrefix;
export const args = (...list: Operand[]) => {
  const list2: OperandOrOperator[] = [];
  for (let i = 0; i < list.length - 1; i++) {
    list2.push(list[i]);
    list2.push(',');
  }
  list2.push(list[list.length - 1]);
  return new Expression(list2, false, true);
};
export const call = (left: Operand, ...list: Operand[]) => new Expression([left, '(', args(...list), ')'], false, true);
export const rest = (identifier: Operand) => new Expression(['...', identifier], true, true);
