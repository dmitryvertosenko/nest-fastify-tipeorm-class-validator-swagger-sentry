import { ToPgArrayOptions } from '../types/to-pg-array-options.interface';

export const toPgArray = (
  array: unknown[],
  { wildcards, extractionKey, lower, quotes }: ToPgArrayOptions = {},
): string =>
  array?.length
    ? `${quotes ? `'` : ''}{${array
        .map((value) => {
          const item = extractionKey ? value[extractionKey] : value;

          if (typeof item !== 'string') {
            return item;
          }

          return (wildcards ? '"%_item_%"' : '"_item_"').replace(
            /_item_/,
            lower ? item.replace(/"/gm, '\\"').toLowerCase() : item.replace(/"/gm, '\\"'),
          );
        })
        .join(',')}}${quotes ? `'` : ''}`
    : '{}';
