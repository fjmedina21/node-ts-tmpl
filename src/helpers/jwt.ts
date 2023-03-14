import { Request } from "express";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

import { config } from "../config/index";
import { IUser, User } from "../models/user.model";

export function GenerateJWT(
	uId: string,
	{ isAdmin, isUser }: IUser
): Promise<unknown> {
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
				else resolve(token); // TODO : setear header aqui
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

export async function ValidateResetJWT(resetToken: string): Promise<User> {
	const { email } = jwt.verify(
		resetToken,
		config.JWT_RESET_TOKEN_SECRECT
	) as JwtPayload;

	return await User.findOneOrFail({
		select: ["email", "password", "resetToken"],
		where: { email, resetToken },
	});
}

export async function GetToken(
	req: Request
): Promise<string | jwt.JwtPayload | undefined> {
	const token = req.header("auth");

	if (token) return jwt.verify(token, config.JWT_SECRECT);
}