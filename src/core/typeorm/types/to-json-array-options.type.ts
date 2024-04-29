import { ToPgArrayOptions } from './to-pg-array-options.interface';

export type ToJSONArrayOptions = ToPgArrayOptions & { castTo?: 'json' | 'jsonb' };
