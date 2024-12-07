import { Request, Response } from "express";
import schemaController from "../controllers/schemaController";

export default {
	getDatabricksSchemas,
	getDatabricksTables,
	getDatabricksTable,
	getPostgresSchemas,
	getPostgresTables,
	getPostgresTable
};

async function getDatabricksSchemas(req: Request, res: Response) {
	try {
		let ret = await schemaController.getDatabricksSchemas();
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getDatabricksTables(req: Request, res: Response) {
	try {
		if (!req.params.schema) return new Error('Missing required schema');
		let ret = await schemaController.getDatabricksTables(req.params.schema);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getDatabricksTable(req: Request, res: Response) {
	try {
		if (!req.params.schema) return new Error('Missing required schema');
		if (!req.params.table) return new Error('Missing required table');
		let ret = await schemaController.getDatabricksTable(req.params.schema, req.params.table);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getPostgresSchemas(req: Request, res: Response) {
	try {
		let ret = await schemaController.getPostgresSchemas();
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getPostgresTables(req: Request, res: Response) {
	try {
		if (!req.params.schema) return new Error('Missing required schema');
		let ret = await schemaController.getPostgresTables(req.params.schema);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}

async function getPostgresTable(req: Request, res: Response) {
	try {
		if (!req.params.schema) return new Error('Missing required schema');
		if (!req.params.table) return new Error('Missing required table');
		let ret = await schemaController.getPostgresTable(req.params.schema, req.params.table);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}