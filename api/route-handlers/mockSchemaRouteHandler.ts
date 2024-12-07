import { Request, Response } from "express";
import mockSchemaController from "../controllers/mockSchemaController";
import { getUserInfo } from "../routes/routerCommon";
import config from "../config/constants";
import { SchemaType } from "../types/types";

export default {
	createSchema,
	getSchema,
	getSchemas,
	saveSchema,
	deleteSchema,
	streamSchemaToDatabase,
	streamSchemaToExport
};

async function createSchema(req: Request, res: Response) {
	try {
		let ret = await mockSchemaController.createSchema(getUserInfo(req), req.body);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getSchema(req: Request, res: Response) {
	try {
		let ret = await mockSchemaController.getSchema(getUserInfo(req), +req.params.id);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getSchemas(req: Request, res: Response) {
	try {
		let schemaType = req.params.type as SchemaType;
		if (!config.SCHEMA_TYPES.includes(schemaType)) {
			return new Error('Invalid schema type');
		}

		let ret = await mockSchemaController.getSchemas(getUserInfo(req), schemaType);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function saveSchema(req: Request, res: Response) {
	try {
		let ret = await mockSchemaController.saveSchema(getUserInfo(req), +req.params.id, req.body);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function deleteSchema(req: Request, res: Response) {
	try {
		await mockSchemaController.deleteSchema(getUserInfo(req), +req.params.id);
		res.status(200).send();
	} catch (e) { throw e; }
}

async function streamSchemaToDatabase(req: Request, res: Response) {
	try {
		if (req.params.id == null || isNaN(parseInt(req.params.id)))
			return new Error('Invalid download id');

		let ret = await mockSchemaController.streamSchemaToDatabase(getUserInfo(req), +req.params.id, req.body);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function streamSchemaToExport(req: Request, res: Response) {
	try {
		if (req.params.id == null || isNaN(parseInt(req.params.id)))
			return new Error('Invalid download id');

		let ret = await mockSchemaController.streamSchemaToExport(getUserInfo(req), +req.params.id, req.body);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}