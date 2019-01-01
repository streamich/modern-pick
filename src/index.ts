export type Picker<A, B> = (data: A) => B;

/**
 * In generated code `$` refers to the root value, similar to how it is in JSONPath.
 * We cannot use `@` in JavaScript to refer to the current value though, thus
 * current value is denoted by `_`.
 *
 * `x` is a list of interpolations.
 */
export const pick = <A, B>(accessors: TemplateStringsArray, ...interpolations: (string | Function)[]): Picker<A, B> => {
  const applyAccessor = (accessor: string) => {
    if ((accessor[0] !== '.') && (accessor[0] !== '['))
      accessor = '.' + accessor;
    // prettier-ignore
    return (
      `_=_${accessor};`
      /*
      'try{' +
        `_=_${accessor}` +
      '}catch(e){' +
        'return null;' +
      '}'
      */
    );
  };

  const applyFilter = (index: number) => {
    // prettier-ignore
    return (
      '_=(Array.isArray(_)?_:Object.values(_)).filter(function(v,i){' +
        'try{' +
          `return x[${index}](v,i,_,$)` +
        '}catch(e){' +
          'return false' +
        '}' +
      '});'
      /*
      'try{' +
        `_=_.filter(i[${index}])` +
      '}catch(e){' +
        'return null;' +
      '}'
      */
    );
  };

  let body: string = accessors[0] ? applyAccessor(accessors[0]) : '';

  for (let i = 0; i < interpolations.length; i++) {
    const interpolation = interpolations[i];
    if (interpolation instanceof Function) {
      body += applyFilter(i);
    }

    const accessor = accessors[i + 1];
    if (accessor) {
      body += applyAccessor(accessor);
    }
  }

  // prettier-ignore
  const code: string =
    '(function(x){' +
      'return function($,d){' +
        'var _=$;' +
        'try{' +
          body +
          'return _' +
        '}catch(e){' +
          'console.log(e);' +
          'return d' +
        '}' +
      '}' +
    '})';

  // tslint:disable-next-line no-eval ban
  return eval(code)(interpolations);
};
