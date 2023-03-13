import "dotenv/config";
import jwt from "jsonwebtoken";

import { config } from "../config/index";

export function GenerateJWT(uId: string, isAdmin: boolean): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload = { uId, isAdmin };

		jwt.sign(
			payload,
			config.JWT_SECRECT,
			{ expiresIn: config.JWT_EXPIRES_IN },
			(error: unknown, token: string | undefined) => {
				if (error) reject(error);
				else resolve(token);
			}
		);
	});
}

// TODO: implementar UpdatedJWT
/*
export function UpdateJWT(uId: string, isAdmin: boolean): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload = { uId, isAdmin };

		jwt.sign(
			payload,
			"process.env.JWT_SK",
			{ expiresIn: process.env.JWT_EXPIRES_IN },
			(error: unknown, token: string | undefined) => {
				if (error) reject(error);
				else resolve(token);
			}
		);
	});
}
*/
