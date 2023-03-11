import "dotenv/config"

import jwt from "jsonwebtoken";

export function generateJWT(uId: string, role:boolean): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload: object = { uId, role };

		jwt.sign(
			payload,
			process.env.JWT_SK,
			{ expiresIn: "2h" },
			(error: unknown, token: string | undefined) => {
				if (error instanceof Error) reject(error);
				else resolve(token);
			}
		);
	});
}
