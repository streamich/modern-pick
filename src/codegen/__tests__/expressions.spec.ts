import {Expression, expr, exprPrefix, args, call} from '../expressions';

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

test('supports prefix operator', () => {
  const expr1 = exprPrefix('--', 'i');
  expect('' + expr1).toBe('--i');
});

test('supports nested prefix operators', () => {
  const expr1 = expr('a', '.', 'b');
  const expr2 = exprPrefix('--', expr1);
  expect(String(expr2)).toBe('--(a.b)');
});

test('single argument in list', () => {
  const expr1 = args('a');
  expect(String(expr1)).toBe('a');
});

test('multiple argument in list', () => {
  const expr1 = args('a', 'b', 1, 2);
  expect(String(expr1)).toBe('a,b,1,2');
});

test('call expression with single identifier argument', () => {
  const expr1 = call('a', 'b');
  expect('' + expr1).toBe('a(b)');
});

test('console.log(1, 2, 3) call expression', () => {
  const expr1 = call(expr('console', '.', 'log'), 1, 2, 3);
  expect('' + expr1).toBe('console.log(1,2,3)');
});
