'use strict';
import { Request } from 'express';

// module exports

export function getUserInfo(req: Request) {
	return {
		cacid: req.session.user.id,
		name: req.session.user.displayName
	};
}