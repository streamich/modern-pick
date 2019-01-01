export type Picker<A, B> = (data: A) => B;
export type ParametrizedPicker<A, B> = (...args: any[]) => Picker<A, B>;

const REG_TRIM = /^\s+|\s+$/g;
const trim = (str: string): string => str.replace(REG_TRIM, '');
const MAP_OPERATOR = '->';
const ACCESSOR_OPERATOR = '.';

const rangeToPredicate = (range: string) => {
  const parts = range.split(':');
  const start = parts[0] ? Number(parts[0]) : 0;
  const endSpecified = !!parts[1];
  const end = parts[1] ? Number(parts[1]) : 0;
  const step = parts[2] ? Number(parts[2]) : 1;

  return (value, i, len) => {
    let xstart = start >= 0 ? start : len + start;
    let xend = endSpecified ? (end >= 0 ? end : len + end) : len;
    if (xend < xstart) [xstart, xend] = [xend, xstart];
    if (i < xstart) return false;
    if (i >= xend) return false;
    return (i - xstart) % step ? false : true;
  };
};

const arr = 'Array.isArray(_)?_:Object.values(_)';

const codegenAccessor = (accessor: string) => {
  if (accessor[0] === '{') {
    // prettier-ignore
    return (
      `_=((${accessor})=>(${accessor}))(_);`
    );
  } else {
    if (accessor[0] !== '.' && accessor[0] !== '[') accessor = '.' + accessor;
    // prettier-ignore
    return (
      `_=_${accessor};`
    );
  }
};

const codegenAccessorMap = (accessor: string) => {
  if (accessor[0] === '{') {
    // prettier-ignore
    return (
      `_=(${arr}).map((${accessor})=>{` +
        'try{' +
          `return ${accessor}` +
        '}catch(e){' +
          'return {}' +
        '}' +
      '});'
    );
  } else {
    if (accessor[0] !== '.' && accessor[0] !== '[') accessor = '.' + accessor;
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
  }
};

const codegenFilter = (index: number) => {
  // prettier-ignore
  return (
    `var arr=${arr};` +
    `_=arr.filter(function(v,i){` +
      'try{' +
        `var r=x[${index}](v,i,arr.length,arr,_,$);` +
        'console.log(a);' +
        'return r instanceof Function ? r.apply(null, a) : r' +
      '}catch(e){' +
        'return false' +
      '}' +
    '});'
  );
};

/**
 * - In generated code `$` refers to the root value, similar to how it is in JSONPath.
 * - We cannot use `@` in JavaScript to refer to the current value though, thus
 *   current value is denoted by `_`.
 * - `x` is a list of interpolations.
 * - `a` is an array of interpolation arguments.
 */
export const pick = <A, B>(
  accessors: TemplateStringsArray,
  ...interpolations: (number | string | Function)[]
): ParametrizedPicker<A, B> => {
  let currentValueIsArray = false;
  let nextInterpolationIsMap = false;
  let nextInterpolationIsAccessor = false;
  let functionalInterpolationAccessorIndex = 0;
  let body: string = '';

  const applyAccessor = (accessor) => {
    accessor = trim(accessor);
    if (accessor) {
      if (accessor.endsWith(ACCESSOR_OPERATOR)) {
        nextInterpolationIsAccessor = true;
        accessor = accessor.substr(0, accessor.length - ACCESSOR_OPERATOR.length);
      }
      if (accessor.startsWith(MAP_OPERATOR)) {
        if (accessor.length === MAP_OPERATOR.length) {
          nextInterpolationIsMap = true;
        } else {
          body += codegenAccessorMap(trim(accessor.substr(MAP_OPERATOR.length)));
        }
        currentValueIsArray = true;
      } else {
        body += codegenAccessor(accessor);
      }
    }
  };

  const applyInterpolation = (interpolation, i) => {
    if (nextInterpolationIsAccessor) {
      if (interpolation instanceof Function) {
        const accessor = `[a[${functionalInterpolationAccessorIndex}]]`;
        body += codegenAccessor(accessor);
        functionalInterpolationAccessorIndex++;
      } else {
        const accessor = trim(String(interpolation));
        body += codegenAccessor(`[${JSON.stringify(accessor)}]`);
      }
    } else if (nextInterpolationIsMap) {
      // TODO: not implemented.
    } else if (interpolation instanceof Function) {
      body += codegenFilter(i);
      currentValueIsArray = true;
    } else if (typeof interpolation === 'string') {
      interpolations[i] = rangeToPredicate(interpolation);
      body += codegenFilter(i);
      currentValueIsArray = true;
    }
  };

  applyAccessor(accessors[0]);

  for (let i = 0; i < interpolations.length; i++) {
    applyInterpolation(interpolations[i], i);
    nextInterpolationIsAccessor = false;
    applyAccessor(accessors[i + 1]);
  }

  // prettier-ignore
  const code: string =
    '(function(x){' +
      'return function(){' +
        'var a=Array.prototype.slice.call(arguments);' +
        'return function($,d){' +
          'var _=$;' +
          'try{' +
            body +
            'return _' +
          '}catch(e){' +
            // 'console.log(e);' +
            'return d' +
          '}' +
        '}' +
      '}' +
    '})';

  // console.log(require('js-beautify').js_beautify(code, {indent_size: 2}));

  // tslint:disable-next-line no-eval ban
  return eval(code)(interpolations) as ParametrizedPicker<A, B>;
};
