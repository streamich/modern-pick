export class Expression {
  operators: string[];
  operands: string[];
  operandFirst: boolean;

  constructor (operators: string[], operands: string[], operandFirst: boolean = true) {
    this.operators = operators;
    this.operands = operands;
    this.operandFirst = operandFirst;
  }

  toString() {
    const first = this.operandFirst ? this.operands : this.operators;
    const second = this.operandFirst ? this.operators : this.operands;
    return first.reduce((acc, f, i) => acc + f + (second[i] || ''), '');
  }
}
