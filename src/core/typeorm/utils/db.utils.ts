export const dbUtils = {
  moveToStartFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION move_to_start(jsonb_array jsonb, entity_id uuid)
        RETURNS jsonb
        LANGUAGE plpgsql
      AS $function$
        DECLARE
          head jsonb;
          tail jsonb;
        BEGIN
          head := (
            SELECT
              COALESCE(jsonb_agg(a.*), '[]')
            FROM jsonb_array_elements(jsonb_array) AS a
            WHERE (a->>'id')::uuid = entity_id
          );

          tail := (
            SELECT
              COALESCE(jsonb_agg(a.*), '[]')
            FROM jsonb_array_elements(jsonb_array) AS a
            WHERE (a->>'id')::uuid != entity_id
          );

          RETURN head || tail;
        END
      $function$
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION move_to_start;
    `,
  },

  cutToLimitFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION cut_to_limit(_array jsonb, _limit int)
        RETURNS jsonb
        LANGUAGE plpgsql
      AS $function$
        DECLARE
          _result jsonb;
        BEGIN
          CASE
            WHEN _limit IS NULL OR _limit < 1 THEN
              _result := _array;

            ELSE
              _result:= jsonb_path_query_array(_array, '$[0 to $index]', jsonb_build_object('index', _limit - 1));
          END CASE;

          RETURN _result;
        END
      $function$
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION cut_to_limit;
    `,
  },

  nullToEmpty: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION null_to_empty(_value anyelement)
        RETURNS anyelement
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          IF _value IS NOT NULL THEN
            RETURN _value;
          END IF;

          CASE pg_typeof(_value)
            WHEN pg_typeof('1970-01-01'::date) THEN
              RETURN '0001-01-01'::date;

            WHEN pg_typeof(0::float) THEN
              RETURN -1;

            WHEN pg_typeof(''::varchar) THEN
              RETURN '';

            WHEN pg_typeof(''::text) THEN
              RETURN '';

            WHEN pg_typeof('{}'::uuid[]) THEN
              RETURN '{}';

            WHEN pg_typeof('{}'::varchar[]) THEN
              RETURN '{}';

            ELSE
              RETURN _value;
          END CASE;
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION null_to_empty;
    `,
  },

  emptyToNull: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION empty_to_null(_value anyelement)
        RETURNS anyelement
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          IF _value::text IN ('0001-01-01', '-1', '', '{}') THEN
            RETURN NULL;
          END IF;

          RETURN _value;
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION null_to_empty;
    `,
  },

  escapeDashesAndSpasesFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION escape_dashes_and_spaces(_value anyelement)
        RETURNS text
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN regexp_replace(
            regexp_replace(
              _value::text,
              '-',
              '_dash_',
              'g'
            ),
            ' ',
            '_space_',
            'g'
          );
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION escape_dashes_and_spaces;
    `,
  },

  stripDashesAndSpasesFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION strip_dashes_and_spaces(_value anyelement)
        RETURNS text
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN regexp_replace(_value::text, '\s|-', '', 'g');
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION escape_dashes_and_spaces;
    `,
  },

  stripTokenizerSeparatorsFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION strip_tokenizer_separators(_value anyelement)
        RETURNS text
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN lower(regexp_replace(_value::text, '\s|-|\/', '', 'g'));
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION strip_tokenizer_separators;
    `,
  },

  dateObjToDateFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION date_obj_to_date(_date_obj jsonb)
        RETURNS date
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN (
            _date_obj->>'year' ||
            '-' ||
            COALESCE(_date_obj->>'month', '01') ||
            '-' ||
            COALESCE(_date_obj->>'day', '01')
          )::date;
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION date_obj_to_date;
    `,
  },

  dateObjToOrderPatternFunction: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION date_obj_to_order_pattern(_date_obj jsonb)
        RETURNS varchar
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN _date_obj->>'year' ||
            COALESCE('-' || (_date_obj->>'month')::text, '') ||
            COALESCE('-' || (_date_obj->>'day')::text, '');
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION date_obj_to_order_pattern;
    `,
  },

  base64EndcodeAndEscape: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION base64_endcode_and_escape(_value anyelement)
        RETURNS text
        LANGUAGE plpgsql
      AS $function$
        BEGIN
          RETURN regexp_replace(
            regexp_replace(
              translate(encode((_value::text)::bytea, 'base64'), E'\n', ''),
              '\/', '_', 'g'
            ), '\+', '-', 'g'
          );
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION base64_endcode_and_escape;
    `,
  },

  moneyView: {
    createQuery: /*sql*/ `
      CREATE OR REPLACE FUNCTION money_view(_value float)
        RETURNS text
        LANGUAGE plpgsql
      AS $function$
        DECLARE
          _value_abs float;
        BEGIN
          _value_abs := abs(_value);

          CASE
            WHEN _value_abs >= 1000000 AND _value_abs < 1000000000 THEN
              RETURN '$' || regexp_replace(to_char(_value / 1000000, 'FM999.9'), '\.$', '') || 'M';

            WHEN _value_abs >= 1000 AND _value_abs < 1000000 THEN
              RETURN '$' || regexp_replace(to_char(_value / 1000, 'FM999.9'), '\.$', '') || 'K';

            WHEN _value_abs >= 1000000000 AND _value_abs < 1000000000000 THEN
              RETURN '$' || regexp_replace(to_char(_value / 1000000000, 'FM999.9'), '\.$', '') || 'B';

            WHEN _value_abs >= 1000000000000 AND _value_abs < 1000000000000000 THEN
              RETURN '$' || regexp_replace(to_char(_value / 1000000000000, 'FM999.9'), '\.$', '') || 'T';

            ELSE
              RETURN '$' || _value::text;
          END CASE;
        END
      $function$;
    `,

    dropQuery: /*sql*/ `
      DROP FUNCTION money_view;
    `,
  },
};
