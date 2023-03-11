import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../models";

export async function validateJWT(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.header("x-token");

		if (!token) return res.status(401).json({ mgs: "Token is mising" });

		const payload: string | JwtPayload = jwt.verify(token, "secrect-key");
		const { uId } = payload as JwtPayload;

		//Check if logged user exist
		const user: User | null = await User.findOneBy({
			uId: uId,
			state: true,
		});

		if (!user) {
			return res.status(404).json({ msg: "Invalid token" });
		}

		next();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.header("x-token");

		if (!token) {
			return res.status(401).json({ mgs: "Token is mising" });
		}

		const payload: string | JwtPayload = jwt.verify(token, "secrect-key");
		const { role } = payload as JwtPayload;

		if (!role) {
			return res.status(403).json({ msg: "action not allowed" });
		}

		next();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
}
