export type Picker<A, B> = (data: A) => B;

const REG_TRIM = /^\s+|\s+$/g;
const trim = (str: string): string => str.replace(REG_TRIM, '');

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
    );
  };

  const arr = 'Array.isArray(_)?_:Object.values(_)';

  const applyFilter = (index: number) => {
    // prettier-ignore
    return (
      `_=(${arr}).filter(function(v,i){` +
        'try{' +
          `return x[${index}](v,i,_,$)` +
        '}catch(e){' +
          'return false' +
        '}' +
      '});'
    );
  };

  const applyRange = (range: string) => {
    const parts = range.split(':');
    const start = parts[0] ? Number(parts[0]) : 0;
    const endSpecified = !!parts[1];
    const end = parts[1] ? Number(parts[1]) : 0;
    const step = parts[2] ? Number(parts[2]) : 1;
    // prettier-ignore
    return (
      'var tmp=[],' +
        `arr=${arr},` +
        `s0=${start >= 0 ? start : `arr.length${start}`},` +
        (endSpecified
          ? `s1=${end >= 0 ? end : `arr.length${end}`},`
          : 's1=arr.length,'
        ) +
        `step=${step};` +
      'if(s1<s0){' +
        'var f=s1;s1=s0;s0=f' +
      '}' +
      'for(var i=s0;i<s1;i+=step){' +
        'tmp.push(arr[i])' +
      '}' +
      '_=tmp;'
    );
  };

  const accessor = trim(accessors[0]);
  let body: string = accessor ? applyAccessor(accessor) : '';

  for (let i = 0; i < interpolations.length; i++) {
    const interpolation = interpolations[i];
    if (interpolation instanceof Function) {
      body += applyFilter(i);
    } else if(typeof interpolation === 'string') {
      body += applyRange(interpolation);
    }

    const accessor = trim(accessors[i + 1]);
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
