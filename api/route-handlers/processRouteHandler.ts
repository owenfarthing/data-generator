import { Request, Response } from "express";
import processController from "../controllers/processController";

export default {
	getProcess
};

async function getProcess(req: Request, res: Response) {
	try {
		let ret = await processController.getProcess(+req.params.id);
		return res.status(200).send(ret);
	} catch (e) { throw e; }
}