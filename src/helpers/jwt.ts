import { Request } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { config } from "../config";
import { User } from "../models";

export function GenerateJWT(uId: string, isAdmin: boolean, isUser: boolean): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload = { uId, isAdmin, isUser };

		const options: SignOptions = {
			expiresIn: config.JWT_SESSION_EXPIRES_IN,
		};

		jwt.sign(
			payload,
			config.JWT_SECRECT,
			options,
			(error: unknown, token: string | undefined) => {
				if (error) reject(error);
				else resolve(token);
			}
		);
	});
}

export function GenerateResetJWT(email: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload = { email };

		const options: SignOptions = {
			expiresIn: config.JWT_RESET_TOKEN_EXPIRES_IN,
		};

		jwt.sign(
			payload,
			config.JWT_RESET_TOKEN_SECRECT,
			options,
			(error: unknown, token: string | undefined) => {
				if (error) reject(error);
				else resolve(token);
			}
		);
	});
}

export async function ValidateResetJWT(resetToken: string): Promise<User | null> {
	const { email } = jwt.verify(
		resetToken,
		config.JWT_RESET_TOKEN_SECRECT
	) as JwtPayload;

	return await User.findOne({
		select: ["uId", "password", "resetToken"],
		where: { email, resetToken },
	});
}

export async function GetToken(
	req: Request
): Promise<string | jwt.JwtPayload | undefined> {
	const token: string | undefined = req.header("auth");

	if (token) return jwt.verify(token, config.JWT_SECRECT);
}
