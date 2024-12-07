import { Response } from 'express';
import { sql } from 'kysely';
import constants from '../config/constants';
import { downloadFileToRes } from '../utils/aws/s3';
import { webappDB } from '../database/kysely';
import { User } from '../types/types';

const { IN_PROGRESS, SUCCESS, FAILURE } = constants.STREAMING_STATUSES;

export default {
	getDownloads,
	getDownload,
	getDownloadsById,
	beginDownload,
	finishDownload,
	abortDownload,
	updateDownloadProgress,
	downloadSchema
};

// module exports

async function getDownloads(user: User) {
	try {
		// Retrieve downloads from the last 30 days
		return await webappDB.selectFrom('downloads as d')
			.leftJoin('schemas as s', 's.id', 'd.schema_id')
			.selectAll('d')
			.select('s.name')
			.where((eb) => eb.and([
				eb('d.created_by', '=', user.cacid),
				eb.or([
					eb('d.status', '=', SUCCESS),
					// Only fetch in-progress downloads from the last 12 hours
					eb.and([
						eb('status', '=', IN_PROGRESS),
						sql`extract(hour from now() - d.created_at::timestamp) < 13`.$castTo<boolean>()
					])
				]),
				sql`extract(day from now() - d.created_at::timestamp) <= 30`.$castTo<boolean>()
			]))
			.orderBy('created_at', 'desc')
			.execute();
	} catch (e) { throw e; }
}

async function getDownloadsById(params: { downloadIds: number[] }) {
	try {
		const { downloadIds } = params;

		if (!Array.isArray(downloadIds)) return new Error('Invalid download ids');

		return await webappDB.selectFrom('downloads as d')
			.leftJoin('schemas as s', 's.id', 'd.schema_id')
			.selectAll('d')
			.select('s.name')
			.where('d.id', 'in', downloadIds)
			.execute();
	} catch (e) { throw e; }
}

async function getDownload(downloadId: number) {
	try {
		return await webappDB.selectFrom('downloads')
			.selectAll()
			.where('id', '=', downloadId)
			.executeTakeFirstOrThrow(() => new Error('Could not find download'));
	} catch (e) { throw e; }
}

async function beginDownload(
	user: User,
	schemaId: number,
	filename: string,
	s3Filename: string
) {
	try {
		let idRow = await webappDB.insertInto('downloads')
			.values({
				schema_id: schemaId,
				filename,
				s3_filename: s3Filename,
				created_by: user.cacid,
				created_at: sql`now()`
			})
			.returning('id')
			.executeTakeFirst();

		return idRow?.id;
	} catch (e) { throw e; }
}

async function finishDownload(id: number, fileSize: number) {
	try {
		await webappDB.updateTable('downloads')
			.set((eb) => ({
				progress: eb.ref('total'),
				file_size: fileSize,
				status: SUCCESS
			}))
			.where('id', '=', id)
			.execute();
	} catch (e) { throw e; }
}

async function abortDownload(id: number) {
	try {
		await webappDB.updateTable('downloads').set({ status: FAILURE }).where('id', '=', id).execute();
	} catch (e) { throw e; }
}

async function updateDownloadProgress(id: number, progress: number, total?: number) {
	try {
		await webappDB.updateTable('downloads')
			.set({ progress, total })
			.where('id', '=', id)
			.execute();
	} catch (e) { throw e; }
}

async function downloadSchema(id: number, res: Response) {
	try {
		let download = await webappDB
			.selectFrom('downloads')
			.select(['filename', 's3_filename'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow(() => new Error('Could not find download'));
		const { s3_filename, filename } = download;

		if (!s3_filename || !filename) {
			res.status(400).send({ message: 'Missing required file info for download' });
			return;
		}

		await downloadFileToRes(s3_filename, filename, res);
	} catch (e) { throw e; }
}