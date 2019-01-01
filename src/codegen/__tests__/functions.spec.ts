import {fn, arr} from '../functions';
import {e, args} from '../expressions';
import {block, ret} from '../statements';

describe('ArrowFunction', () => {
  test('supports single statement block statement with no arguments', () => {
    const res = arr(e(''), block(e('a')));
    expect(String(res)).toBe('()=>{a;}');
  });

  test('supports multiple arguments and multiple block statements', () => {
    const res = arr(args('a', 'b', 'c'), block(e('a', '=', e('a', '+', 'b')), ret(e('c'))));
    expect(String(res)).toBe('(a,b,c)=>{a=(a+b);return c;}');
  });

  test('allow array instead of block statement', () => {
    const res = arr(args('a', 'b', 'c'), [e('a', '=', e('a', '+', 'b')), ret(e('c'))]);
    expect(String(res)).toBe('(a,b,c)=>{a=(a+b);return c;}');
  });
});
