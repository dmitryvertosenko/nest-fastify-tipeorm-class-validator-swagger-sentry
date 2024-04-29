import { ToJSONArrayOptions } from '../types/to-json-array-options.type';

export const toJSONArray = (
  array: unknown[],
  { wildcards, extractionKey, lower, quotes, castTo }: ToJSONArrayOptions = {},
): string =>
  array?.length
    ? `${castTo ? `(${!quotes ? `'` : ''}` : ''}${quotes ? `'` : ''}[${array
        .map((value) => {
          const item: string = extractionKey ? value[extractionKey] : value;

          const mask: string = wildcards ? '"%_item_%"' : '"_item_"';

          return mask.replace(/_item_/, lower ? item.toLowerCase() : item);
        })
        .join(',')}]${quotes ? `'` : ''}${castTo ? `${!quotes ? `'` : ''})::${castTo}` : ''}`
    : '[]';
