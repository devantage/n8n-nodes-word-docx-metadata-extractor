import type { JSONObject } from '../types';

export function getValueAtPath<R = string>(
  obj: JSONObject,
  path: string,
  converter?: (value: unknown) => R,
): R | undefined {
  const keys: string[] = path.split('.');

  const result: string | undefined = keys.reduce<string | undefined>(
    (acc: string | undefined, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }

      return undefined;
    },
    obj as unknown as string | undefined,
  );

  if (!result || !Object.keys(result).length) return undefined;

  return converter ? converter(result) : (result as R);
}
