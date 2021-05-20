export const indexOutOfBounds = (index: number, list: unknown[]): boolean =>
  index < 0 || index > list.length - 1;
