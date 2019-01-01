export type Picker<A, B> = (data: A) => B;

const REG_TRIM = /^\s+|\s+$/g;
const trim = (str: string): string => str.replace(REG_TRIM, '');

const rangeToPredicate = (range: string) => {
  const parts = range.split(':');
  const start = parts[0] ? Number(parts[0]) : 0;
  const endSpecified = !!parts[1];
  const end = parts[1] ? Number(parts[1]) : 0;
  const step = parts[2] ? Number(parts[2]) : 1;

  return (value, i, len) => {
    let xstart = start >= 0 ? start : len + start;
    let xend = endSpecified
      ? end >= 0 ? end : len + end
      : len;
    if (xend < xstart) [xstart, xend] = [xend, xstart];
    if (i < xstart) return false;
    if (i >= xend) return false;
    return ((i - xstart) % step) ? false : true;
  };
};

/**
 * In generated code `$` refers to the root value, similar to how it is in JSONPath.
 * We cannot use `@` in JavaScript to refer to the current value though, thus
 * current value is denoted by `_`.
 *
 * `x` is a list of interpolations.
 */
export const pick = <A, B>(accessors: TemplateStringsArray, ...interpolations: (string | Function)[]): Picker<A, B> => {
  const arr = 'Array.isArray(_)?_:Object.values(_)';

  const applyAccessor = (accessor: string) => {
    if ((accessor[0] !== '.') && (accessor[0] !== '['))
      accessor = '.' + accessor;
    // prettier-ignore
    return (
      `_=_${accessor};`
    );
  };

  const applyAccessorMap = (accessor: string) => {
    if ((accessor[0] !== '.') && (accessor[0] !== '['))
      accessor = '.' + accessor;
    // prettier-ignore
    return (
      `_=(${arr}).map(function(v){` +
        'try{' +
          `return v${accessor}` +
        '}catch(e){' +
          'return d' +
        '}' +
      '});'
    );
  };

  const applyFilter = (index: number) => {
    // prettier-ignore
    return (
      `var arr=${arr};` +
      `_=arr.filter(function(v,i){` +
        'try{' +
          `return x[${index}](v,i,arr.length,arr,_,$)` +
        '}catch(e){' +
          'return false' +
        '}' +
      '});'
    );
  };

  const accessor = trim(accessors[0]);
  let body: string = accessor ? applyAccessor(accessor) : '';
  let currentValueIsArray = false;
  let nextInterpolationIsMap = false;

  for (let i = 0; i < interpolations.length; i++) {
    const interpolation = interpolations[i];
    if (nextInterpolationIsMap) {
      // TODO: not implemented.
    } else if (interpolation instanceof Function) {
      body += applyFilter(i);
      currentValueIsArray = true;
    } else if(typeof interpolation === 'string') {
      interpolations[i] = rangeToPredicate(interpolation);
      body += applyFilter(i);
      currentValueIsArray = true;
    }

    const accessor = trim(accessors[i + 1]);
    if (accessor) {
      if (accessor[0] === '>') {
        if (accessor.length === 1) {
          nextInterpolationIsMap = true;
        } else {
          body += applyAccessorMap(accessor.substr(1));
        }
        currentValueIsArray = true;
      } else {
        body += applyAccessor(accessor);
      }
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
