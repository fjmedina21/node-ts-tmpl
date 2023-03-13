import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models";

export async function ValidateJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.header("x-token");

		if (!token) return res.status(401).json({ mgs: "Token is mising" });

		const payload: string | JwtPayload = jwt.verify(
			token,
			"process.env.JWT_SK"
		);
		const { uId } = payload as JwtPayload;

		//Check if logged user is active
		const user: User | null = await User.findOneBy({
			uId: uId,
			state: true,
		});

		if (!user) {
			return res.status(404).json({ msg: "Invalid token" });
		}

		next();
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}

export async function IsAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.header("x-token");

		if (!token) {
			return res.status(401).json({ mgs: "Token is mising" });
		}

		const payload: string | JwtPayload = jwt.verify(
			token,
			"process.env.JWT_SK"
		);
		const { isAdmin } = payload as JwtPayload;

		if (!isAdmin) {
			return res.status(403).json({ msg: "action not allowed" });
		}

		next();
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}
