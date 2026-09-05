/**
 * Builds a Prisma data object from only the keys that are actually present
 * in the source object, instead of the repeated `if (x) data.x = x` pattern.
 *
 * Uses `!== undefined` rather than a truthy check - the old truthy checks
 * meant a client could never unset a boolean flag to `false`, clear a field
 * to `0`, or clear a string to `""` via an update, since falsy-but-valid
 * values were silently dropped.
 */
export function pickDefined<T extends Record<string, any>>(
  source: T,
  keys: readonly (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
