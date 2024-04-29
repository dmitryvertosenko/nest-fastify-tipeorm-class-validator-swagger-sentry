export interface ResponseBody<
  T = Readonly<
    | Readonly<Record<string | number | symbol, unknown>>
    | Readonly<Record<string | number | symbol, unknown>>[]
    | unknown
    | null
  >,
> {
  readonly message?: string;

  readonly meta?: Readonly<Record<string | number | symbol, unknown>> | null;

  readonly data?: T;
}
