// external imports
import { CompiledQuery } from 'kysely';

// internal imports
import { dataDB } from '../database/kysely';

export default {
	runQuery
};

async function runQuery(sql: string) {
	try {
		let compiledSql: CompiledQuery = {
			sql,
			query: {
				kind: 'RawNode',
				parameters: [],
				sqlFragments: []
			},
			parameters: []
		};

		return await dataDB
			.executeQuery(compiledSql)
			.catch((e: Error) => { throw e; });
	} catch (e) { throw e; }
}