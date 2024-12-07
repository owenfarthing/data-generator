'use strict';

// external imports
import { Response, Request } from 'express';

// internal imports
import downloadController from '../controllers/downloadController';
import { getUserInfo } from '../routes/routerCommon';

export default {
	getDownloads,
	getDownloadsById,
	getDownload,
	downloadSchema
};

// module exports

async function getDownloads(req: Request, res: Response) {
	try {
		let ret = await downloadController.getDownloads(getUserInfo(req));
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getDownloadsById(req: Request, res: Response) {
	try {
		let ret = await downloadController.getDownloadsById(req.body);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getDownload(req: Request, res: Response) {
	try {
		if (req.params.id == null || isNaN(parseInt(req.params.id)))
			return new Error('Invalid download id');

		let ret = await downloadController.getDownload(+req.params.id);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function downloadSchema(req: Request, res: Response) {
	try {
		if (req.params.id == null || isNaN(parseInt(req.params.id)))
			return new Error('Invalid download id');

		await downloadController.downloadSchema(+req.params.id, res);
	} catch (e) { throw e; }
}