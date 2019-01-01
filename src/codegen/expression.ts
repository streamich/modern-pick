export type OperandOrOperator = string | Expression;

export class Expression {
  opops: OperandOrOperator[]; // Operands and operators.
  prefixOperator: boolean;

  constructor (opops: OperandOrOperator[], prefixOperator?: boolean) {
    this.opops = opops;
    this.prefixOperator = !!prefixOperator;
  }

  toString() {
    const {prefixOperator} = this;
    return this.opops.reduce((acc, op, i) => {
      const isOperand = prefixOperator ? !(i % 2) : !!(i % 2);
      const isExpression = op instanceof Expression;
      const evaluated = String(op);
      return isOperand && isExpression
        ? acc + '(' + evaluated + ')'
        : acc + evaluated;
    }, '');
  }
}

export const expr = (...opops: OperandOrOperator[]) => new Expression(opops, true);
export const exprPrefix = (...opops: OperandOrOperator[]) => new Expression(opops, false);
