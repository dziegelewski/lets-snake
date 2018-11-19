export function times(howMany: number, fn: (index: number) => any): any[] {
  return new Array(howMany).fill(null).map((_, index) => index).map(fn);
}
