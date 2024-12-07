import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Downloads {
  created_at: Timestamp | null;
  created_by: string;
  file_size: Generated<Int8 | null>;
  filename: string | null;
  id: Generated<number>;
  location: string | null;
  progress: Generated<number | null>;
  s3_filename: string | null;
  schema_id: number;
  status: Generated<number | null>;
  total: Generated<number | null>;
}

export interface Processes {
  created_at: Timestamp;
  created_by: string;
  error: string | null;
  id: Generated<number>;
  progress: Generated<number | null>;
  total: Generated<number | null>;
  updated_at: Timestamp;
}

export interface Schemas {
  created_at: Timestamp;
  created_by: string;
  id: Generated<number>;
  name: string;
  schema: Json;
  schema_type: string;
  updated_at: Timestamp;
}

export interface DB {
  downloads: Downloads;
  processes: Processes;
  schemas: Schemas;
}
