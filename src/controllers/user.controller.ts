import { Response, Request } from "express";
//import { JwtPayload } from "jsonwebtoken";

import { User, IUser } from "../models";
//import { GetToken } from "../helpers/index";

export async function GetUsers(req: Request, res: Response) {
	try {
		const users: [User[], number] =
			(await User.findAndCount({
				where: { state: true },
				order: { updatedAt: "DESC", createdAt: "DESC" },
			})) || [];

		return res.status(200).json({
			result: {
				ok: true,
				total: users[1],
				users: users[0],
			},
		});
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

export async function GetUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user: User =
			(await User.findOneByOrFail({ uId: id, state: true })) || {};

		return res.status(200).json({
			result: {
				ok: true,
				user,
			},
		});
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

export async function PatchUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { firstName, lastName, email, isAdmin }: IUser = req.body;


		const user: User = await User.findOneByOrFail({ uId: id });
		//const token = (await GetToken(req)) as JwtPayload;

		user.firstName = firstName ? firstName : user.firstName;
		user.lastName = lastName ? lastName : user.lastName;
		user.email = email ? email : user.email;

		//TODO: validar role desde el tokem en el header
		// if admin set someone else data keep token but if it's his own genera new token
		/*if (token.isAdmin) {
			user.isAdmin = isAdmin;
			const roles = { isAdmin: user.isAdmin, isUser: user.isUser } as IUser;
			await GenerateJWT(user.uId, roles);
		}*/

		await user.save();
		return res
			.status(200)
			.json({ result: { ok: true, message: "User updated", user } });
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
		if (error instanceof Error)
			error = {
				ok: false,
				name: error.name,
				message: error.message,
			};
		return res.status(500).json({ error });
	}
}
