/* eslint-disable @typescript-eslint/no-unsafe-function-type */
type PublicPropertyNamesOf<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type PublicPropertiesOf<T> = Pick<T, PublicPropertyNamesOf<T>>;
