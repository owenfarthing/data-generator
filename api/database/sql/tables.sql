create table datagen.schemas(
	id serial not null primary key,
	name text not null,
	schema_type text not null,
	schema jsonb not null,
	created_by text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);

create table datagen.downloads(
	id serial not null primary key,
	schema_id integer not null,
	filename text,
	s3_filename text,
	location text,
	progress integer default 0,
	total integer default 0,
	file_size bigint default 0,
	status integer default 0,
	created_by text not null,
	created_at timestamp without time zone
);

create table datagen.processes(
	id serial not null primary key,
	progress integer default 0,
	total integer default 0,
	error text,
	created_by text not null,
	created_at timestamp with time zone not null,
	updated_at timestamp with time zone not null
);