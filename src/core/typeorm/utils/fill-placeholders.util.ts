const pgConstants = ['CURRENT_DATE'];

export function fillPlaceholders(query: string, values: Record<string, unknown>): string {
  for (const [key, value] of Object.entries(values)) {
    const operatorRegexp = new RegExp(`!${key}\\b`, 'gm');

    query = query.replace(operatorRegexp, value as string);

    const nameRegexp = new RegExp(`\\$${key}\\b`, 'gm');

    query = query.replace(nameRegexp, `"${value as string}"`);

    const valueRegexp = new RegExp(`:${key}\\b`, 'gm');

    query = query.replace(
      valueRegexp,
      typeof value === 'string' && !pgConstants.includes(value)
        ? `'${value}'`
        : typeof value === 'undefined' || value === null
          ? 'NULL'
          : (value as string),
    );
  }

  return query;
}
