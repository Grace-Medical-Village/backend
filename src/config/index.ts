export const isLocal = (): boolean => process.env.NODE_ENV === 'local';
export const isProduction = (): boolean =>
  process.env.NODE_ENV === 'production';
