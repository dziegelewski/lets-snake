export function times(howMany, fn) {
  return new Array(howMany).fill(null).map((_, index) => index).map(fn);
}
