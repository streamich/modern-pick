export const idx = selector => (state, def?) => {
  try {
    return selector(state);
  } catch {
    return def;
  }
};
