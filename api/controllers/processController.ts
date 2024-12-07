import { webappDB } from '../database/kysely';
import { User } from '../types/types';
import { sql } from 'kysely';

export default {
	createProcess,
	abortProcess,
	getProcess,
	updateProcess
};

async function createProcess(user: User, total: number) {
	try {
		return await webappDB
			.insertInto('processes')
			.values({
				total,
				created_by: user.cacid,
				created_at: sql`now()`,
				updated_at: sql`now()`
			})
			.returning('id')
			.executeTakeFirst()
	} catch (e) { throw e; }
}

async function abortProcess(id: number, error: string) {
	try {
		await webappDB.updateTable('processes').set({ error }).where('id', '=', id).execute();
	} catch (e) { throw e; }
}

async function getProcess(id: number) {
	try {
		if (!id) return new Error('Missing required id');
		return await webappDB
			.selectFrom('processes')
			.select(['progress', 'total', 'error'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow(() => new Error('Process not found'));
	} catch (e) { throw e; }
}

async function updateProcess(id: number, progress: number) {
	try {
		await webappDB.updateTable('processes').set({ progress }).where('id', '=', id).execute();
	} catch (e) { throw e; }
}