import {st, block, fi, ret, decl} from '../statements';
import {expr, call, e} from '../expressions';

describe('Statement', () => {
  test('returns empty string if no statments provided', () => {
    const statement = st()
    expect('' + statement).toBe('');
  });

  test('adds semicolon to expression', () => {
    const statement = st(expr(2, '+', 2))
    expect('' + statement).toBe('2+2;');
  });

  test('supports multiple statements', () => {
    const statement = st(
      expr(2, '+', 2),
      call(
        expr('console', '.', 'log'),
        '"asdf"'
      )
    )
    expect('' + statement).toBe('2+2;console.log("asdf");');
  });
});

describe('BlockStatement', () => {
  test('returns empty block {} if no statments provided', () => {
    const statement = block()
    expect('' + statement).toBe('{}');
  });

  test('adds brackets {} for single statement', () => {
    const statement = block(expr(2, '+', 2))
    expect('' + statement).toBe('{2+2;}');
  });

  test('adds {} around multiple statments', () => {
    const statement = block(
      expr(2, '+', 2),
      call(
        expr('console', '.', 'log'),
        '"asdf"'
      )
    )
    expect('' + statement).toBe('{2+2;console.log("asdf");}');
  });
});

describe('IfStatement', () => {
  test('returns empty block if no statements', () => {
    const statement = fi(expr('false'), block());
    expect('' + statement).toBe('if(false){}');
  });

  test('emits block {} for single statement', () => {
    const statement = fi(expr('a', '+', 1), block(expr('a', '++')));
    expect('' + statement).toBe('if(a+1){a++;}');
  });

  test('supports multiple statements', () => {
    const statement = fi(e('a', '+', 1), block(
      e('a', '++'),
      e(1, '+', 2),
    ));
    expect('' + statement).toBe('if(a+1){a++;1+2;}');
  });

  test('supports else block statements', () => {
    const statement = fi(e('a', '+', 1), block(), block(
      e('a', '++'),
      e(1, '+', 2),
    ));
    expect('' + statement).toBe('if(a+1){}else{a++;1+2;}');
  });

  test('supports else block statements to gether with true block', () => {
    const statement = fi(e('a', '+', 1), block(
      e('a', '++'),
      e(1, '+', 2),
    ), block(
      e('a', '++'),
      e(1, '+', 2),
    ));
    expect('' + statement).toBe('if(a+1){a++;1+2;}else{a++;1+2;}');
  });

  test('single expression in both blocks', () => {
    const statement = fi(e('a', '+', 1), block(
      e(1, '+', 2),
    ), block(
      e('a', '++'),
    ));
    expect('' + statement).toBe('if(a+1){1+2;}else{a++;}');
  });

  test('supports array as block statement', () => {
    const statement = fi(e('a', '+', 1), [
      e('a', '++'),
      e(1, '+', 2),
    ], [
      e('a', '++'),
      e(1, '+', 2),
    ]);
    expect('' + statement).toBe('if(a+1){a++;1+2;}else{a++;1+2;}');
  });

  test('single expression instead of blocks', () => {
    const statement = fi(e('a', '+', 1), e('a'), e('b'));
    expect('' + statement).toBe('if(a+1){a;}else{b;}');
  });
});

describe('ReturnStatement', () => {
  test('generates return keyworkd with semicolon', () => {
    const res = ret(e('abc'));
    expect(String(res)).toBe('return abc;');
  });
});

describe('DeclarationStatement', () => {
  test('can declare default let variable', () => {
    const res = decl(e('a'));
    expect(String(res)).toBe('let a;');
  });

  test('can declare const variable', () => {
    const res = decl(e('a', '=', 125), 'const');
    expect(String(res)).toBe('const a=125;');
  });
});
