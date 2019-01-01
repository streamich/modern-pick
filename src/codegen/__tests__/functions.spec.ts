import {fn} from "../functions";
import {e, args} from "../expressions";
import {block, ret} from "../statements";

describe('ArrowFunction', () => {
  test('supports single statement block statement with no arguments', () => {
    const res = fn(e(''), block(e('a')));
    expect(String(res)).toBe('()=>{a;}');
  });

  test('supports multiple arguments and multiple block statements', () => {
    const res = fn(args('a', 'b', 'c'), block(
      e('a', '=', e('a', '+', 'b')),
      ret(e('c')),
    ));
    expect(String(res)).toBe('(a,b,c)=>{a=(a+b);return c;}');
  });
});
