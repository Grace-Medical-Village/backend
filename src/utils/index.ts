export const indexOutOfBounds = (index: number, list: unknown[]) =>
  index < 0 || index > list.length - 1;
