import { NextFunction, Request, Response } from "express";

import { User } from "../models";
import { GetToken } from "../helpers/index";
import { JwtPayload } from "jsonwebtoken";

export async function ValidateJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { uId } = (await GetToken(req)) as JwtPayload;
		//Check if logged user is active
		await User.findOneByOrFail({
			uId,
			state: true,
		});

		next();
	} catch (error: unknown) {
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: error.message,
			};
		return res.status(500).json({ error });
	}
}

export async function IsAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const { isAdmin } = (await GetToken(req)) as JwtPayload;

		if (!isAdmin) {
			return res
				.status(403)
				.json({ result: { ok: false, message: "Need ADMIN access" } });
		}

		next();
	} catch (error: unknown) {
		error = !error
			? error
			: { result: { ok: false, message: "Need ADMIN access" } };
		return res.status(403).json({ error });
	}
}

export async function IsUserAdmin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { isAdmin, isUser } = (await GetToken(req)) as JwtPayload;

		if (isUser || isAdmin) next();
	} catch (error: unknown) {
		error = !error ? error : { result: { ok: false, message: "Unauthorized" } };
		return res.status(401).json({ error });
	}
}
