import { Response, Request } from "express";
import {hashSync} from "bcryptjs";

import { User } from "../models";

export async function usersGet(req: Request, res: Response) {
	try {
		const users =
			(await User.findAndCount({
				where: { state: true },
				order: { updatedAt: "DESC", createdAt: "DESC" },
			})) || [];

		return res.status(200).json({
			total: users[1],
			users: users[0],
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
}

export async function userGetById(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user = (await User.findOneBy({ uId: id, state: true })) || {};

		if (!user) return res.status(404).json({ message: "User not found" });

		return res.status(200).json({ user });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
}

export async function userPut(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { firstName, lastName, email, isAdmin } = req.body;
		let { password } = req.body;

		const user: User | null = await User.findOneBy({ uId: id });

		if (password) password = hashSync(password, 15);

		if (user) {
			user.firstName = firstName ? firstName : user.firstName;
			user.lastName = lastName;
			user.email = email ? email : user.email;
			user.password = password ? password : user.password;
			user.isAdmin = isAdmin ? isAdmin : user.isAdmin;

			await user.save();
		}

		return res.status(200).json({ msg: "User Updated", user });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
}

export async function userDelete(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const payload = req.body;

		// set state = false but not delete user from db
		await User.update({ uId: id }, payload);

		return res.status(204).json();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
}
