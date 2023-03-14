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
		const userExist: User | null = await User.findOneBy({
			uId,
			state: true,
		});

		if (!userExist) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Login or Signup first",
				},
			});
		}

		next();
	} catch (error: unknown) {
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: "Login or Signup first",
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
		error = { result: { ok: false, message: "Need ADMIN access" } };
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
		error = { result: { ok: false, message: "Unauthorized" } };
		return res.status(401).json({ error });
	}
}
