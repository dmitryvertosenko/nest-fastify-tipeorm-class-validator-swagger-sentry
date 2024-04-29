import { Repository as BaseRepository } from 'typeorm';
import { escapeQueryWithParams as escapeQueryWithParamsUtil } from '../utils/escape-query-with-params.util';

export class Repository<T> extends BaseRepository<T> {
  private PG_CONSTANTS = ['CURRENT_DATE'];

  escapeQueryWithParams = escapeQueryWithParamsUtil;

  unsafeQuery(query: string, replacments: object = {}): string {
    for (const [key, value] of Object.entries(replacments)) {
      const valueRegexp = new RegExp(`:${key}\\b`, 'gm');

      query = query.replace(
        valueRegexp,
        typeof value === 'string' && !this.PG_CONSTANTS.includes(value)
          ? `'${value}'`
          : typeof value === 'undefined' || value === null
            ? 'NULL'
            : <string>value,
      );
    }

    return query.replace(/^\s*$(?:\r\n?|\n)/gm, '');
  }

  async raw(rawQuery: string, replacments: object = {}) {
    const { query, params } = this.escapeQueryWithParams(rawQuery, replacments);

    return this.query(query.replace(/^\s*$(?:\r\n?|\n)/gm, ''), params);
  }
}
