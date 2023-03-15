import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { User } from "../models";
import { GetToken } from "../helpers";

export async function ValidateJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { uId } = (await GetToken(req)) as JwtPayload;

		const userExist: User | null = await User.findOneBy({
			uId,
			state: true,
		});

		if (!userExist) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Session ended",
				},
			});
		}

		next();
	} catch (error: unknown) {
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: "Session ended",
			};
		return res.status(400).json({ result: error });
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
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: "Need ADMIN access",
			};
		return res.status(403).json({ result: error });
	}
}

export async function IsUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { isUser } = (await GetToken(req)) as JwtPayload;

		if (isUser) next();
	} catch (error: unknown) {
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: "Create an account",
			};
		return res.status(401).json({ error });
	}
}

export async function EmailExist(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { email } = req.body;
		const user: User | null = await User.findOneBy({ email });

		if (user) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Someone already has that email address. Try another one.",
				},
			});
		}
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

export async function UserIdExist(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params;
		const user: User | null = await User.findOneBy({ uId: id, state: true });

		if (!user) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "User not found",
				},
			});
		}
		next();
	} catch (error: unknown) {
		return res.status(500).json({
			result: {
				ok: false,
				message: "SV_Err - User not found",
			},
		});
	}
}
