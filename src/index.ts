import {fn, e, ret, decl} from './codegen';

export type Picker<A, B> = (data: A) => B;

/**
 * In generated code `$` refers to the root value, similar to how it is in JSONPath.
 * We cannot use `@` in JavaScript to refer to the current value though, thus
 * current value is denoted by `_`.
 */
export const pick = <A, B>(strings: TemplateStringsArray, ...interpolations: (string | Function)[]): Picker<A, B> => {
  const code = fn(e('$'), [
    decl(e('_', '=', '$'), 'var'),
    e('_', '=',
      e('_', '.', strings[0])
    ),
    ret(e('_')),
  ]);
  const codeString = String(code);
  console.log('codeString', codeString);

  // tslint:disable-next-line no-eval ban
  return eval(codeString);
};
