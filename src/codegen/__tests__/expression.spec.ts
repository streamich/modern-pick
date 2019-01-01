import {Expression, expr} from '../expression';

test('is a constructor', () => {
  expect(Expression).toBeInstanceOf(Function);
});

test('constructs correct Expression instance', () => {
  const expr1 = new Expression(['2', '+', '2']);
  expect(String(expr1)).toBe('2+2');
});

test('expr() helper constructs expression', () => {
  const expr1 = expr('2', '+', '2');
  expect(String(expr1)).toBe('2+2');
});

test('supports nested expressions', () => {
  const expr1 = expr('2', '+', '2');
  const expr2 = expr('counter', '++');
  const expr3 = expr('true', '?', expr1, ':', expr2);
  expect('' + expr3).toBe('true?(2+2):(counter++)');
});
