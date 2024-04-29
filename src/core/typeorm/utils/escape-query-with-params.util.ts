export const escapeQueryWithParams = (query: string, bindings: object): { query: string; params: unknown[] } =>
  Object.entries(bindings).reduce(
    (acc, [key, value]) => {
      const matchRegexp = new RegExp(`^(?!.*--).*:${key}\\b.*$`, 'gm');

      if (matchRegexp.test(query)) {
        acc.params.push(value);

        acc.query = acc.query.replace(matchRegexp, (match) =>
          match.replace(new RegExp(`:${key}\\b`, 'g'), '$' + acc.params.length),
        );
      }

      return acc;
    },
    { query, params: [] },
  );
