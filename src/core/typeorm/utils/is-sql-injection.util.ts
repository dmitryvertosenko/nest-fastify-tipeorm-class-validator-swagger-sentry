export const isSQLInjection = (query: string) =>
  /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*(table|database)+\s*)|(truncate\s*.+)|(alter\s*table+)|(execute\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains)\s*.+[\=\>\<=\!\~]+.+)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*contains\s+.*)))(\s*[\;]\s*)*)+)/i.test(
    query,
  );
