import { toPgArray } from './to-pg-array.util';

export function toIdsArrayLiteral(
  ids: string | number | string[] | number[] | { id: string | number } | { id: string | number }[],
): string {
  if (ids === undefined || ids === null) {
    return '{}';
  }

  if (Array.isArray(ids)) {
    return typeof ids[0] === 'string' ? toPgArray(ids) : toPgArray(ids, { extractionKey: 'id' });
  } else {
    return typeof ids === 'string' ? toPgArray([ids]) : toPgArray([ids], { extractionKey: 'id' });
  }
}
