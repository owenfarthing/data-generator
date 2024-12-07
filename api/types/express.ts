export { }

declare global {
	namespace Express {
		export interface Request {
			session: {
				user: {
					id: string,
					displayName: string
				}
			}
		}
	}
}