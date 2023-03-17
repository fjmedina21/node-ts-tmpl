import { Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";

import { User, IUser } from "../models";
import { GetToken } from "../helpers";

export async function GetUsers(req: Request, res: Response) {
	try {
		const { from = 0, limit = 20 } = req.query;
		const [users, total]: [User[], number] =
			(await User.findAndCount({
				where: { state: true },
				order: { updatedAt: "DESC", createdAt: "DESC" },
				skip: Number(from),
				take: Number(limit),
			})) || [];

		return res.status(200).json({ result: { ok: true, total, users } });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function GetUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user: User = (await User.findOneByOrFail({ uId: id, state: true })) || {};

		return res.status(200).json({ result: { ok: true, user } });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function PatchUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { firstName, lastName, email, isAdmin }: IUser = req.body;

		const user: User = await User.findOneByOrFail({ uId: id });
		const token = (await GetToken(req)) as JwtPayload;

		user.firstName = firstName ? firstName : user.firstName;
		user.lastName = lastName ? lastName : user.lastName;
		user.email = email ? email : user.email;

		if (token.isAdmin) user.isAdmin = isAdmin;


		await user.save();
		return res.status(200).json({ result: { ok: true, message: "User updated", user } });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function DeleteUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { state }: IUser = req.body;

		// set state = false but not delete user from db
		await User.update(
			{ uId: id },
			{ state: state, isUser: false, isAdmin: false }
		);

		return res.status(204).json();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });

	}
}
