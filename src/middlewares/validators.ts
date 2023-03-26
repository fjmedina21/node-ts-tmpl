import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { User } from "../models";
import { ErrorHandler, GetToken } from "../helpers";

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

		if (!userExist) throw new Error();

		next();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ result: { ok: false, message: error.message } });
	}
}

export async function IsAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const { isAdmin } = (await GetToken(req)) as JwtPayload;

		if (!isAdmin) throw new ErrorHandler("Need ADMIN access",403);

		next();
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: { ok: false, message: error.message } });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function IsUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { isUser } = (await GetToken(req)) as JwtPayload;

		if (!isUser) throw new ErrorHandler("login or signup", 400);

		if (isUser) next();
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: { ok: false, message: error.message } });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
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

		if (user) throw new ErrorHandler("Someone already has that email address. Try another one.", 400);

		next();
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: { ok: false, message: error.message } });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
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

		if (!user) throw new Error("User not exist");

		next();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ result: { ok: false, message: error.message } });
	}
}