import { Response, Request } from "express";
import { hashSync } from "bcryptjs";

import { User, IUser } from "../models";
import { ChangePassword } from "../helpers";

export async function GetUsers(req: Request, res: Response) {
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
		return res.status(400).json(error);
	}
}

export async function GetUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user: {} = (await User.findOneBy({ uId: id, state: true })) || {};

		if (!user) return res.status(404).json({ message: "User not found" });

		return res.status(200).json({ user });
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}

export async function PatchUser(req: Request, res: Response) {
	try {
		//TODO: implementar validacion para el email
		const { id } = req.params;
		const { firstName, lastName, email }: IUser = req.body;

		const user: User | null = await User.findOneBy({ uId: id });

		if (user) {
			user.firstName = firstName ? firstName : user.firstName;
			user.lastName = lastName ? lastName : user.lastName;
			user.email = email ? email : user.email;

			await user.save();
		}

		return res.status(200).json({ msg: "User Updated", user });
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}

export async function ChangeUserPassword(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user: User | null = await User.findOneBy({ uId: id });
		const { currentPassword, newPassword, confirmPassword } = req.body;

		if (user) {
			await ChangePassword(id, currentPassword, newPassword, confirmPassword);
			user.password = hashSync(newPassword, 15);
			await user.save();
		}

		return res.status(200).json({
			msg: "User password updated",
			pass: user?.password,
		});
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}

export async function DeleteUser(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { state }: IUser = req.body;

		// set state = false but not delete user from db
		await User.update({ uId: id }, { state: state });

		return res.status(204).json();
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}
