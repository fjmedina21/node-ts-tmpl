import { Response, Request } from "express";
import bcryptjs from "bcryptjs";

import { User } from "../models";
import { generateJWT } from "../helpers";

export const usersGet = async (req: Request, res: Response) => {
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
};

export const userGetById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = (await User.findOneBy({ uId: id, state: true })) || {};

		if (!user) return res.status(404).json({ message: "User not found" });

		return res.status(200).json({ user });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
};

export const userPost = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password } = req.body;
		const user: User = new User();

		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;

		//Encriptar la contraseña
		const salt: string = bcryptjs.genSaltSync();
		user.password = bcryptjs.hashSync(password, salt);

		await user.save();
		const token = await generateJWT(user.uId);

		return res.status(201).json({
			user,
			token,
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
};

export const userPatch = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const payload = req.body;

		if (payload.password) {
			const salt = bcryptjs.genSaltSync();
			payload.password = bcryptjs.hashSync(payload.password, salt);
		}

		await User.update({ uId: id }, payload);

		return res.status(201).json({ msg: "User updated" });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
};

export const userDelete = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const payload = req.body;

		// set state = false but not delete user from db
		await User.update({ uId: id }, payload);

		// delete user from db
		//await User.delete({ uId: id });

		return res.status(204).json();
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
};
