import "dotenv/config";

import { Response, Request, CookieOptions } from "express";
import { hashSync, compareSync } from "bcryptjs";

import { User, IUser } from "../models";
import { GenerateJWT, UpadatePassword } from "../helpers";

function SendCookie(res: Response, token: unknown) {
	try {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
		};

		return res.cookie("jwt", token, cookieOptions);
	} catch (error: unknown) {
		return;
	}
}

export async function SignUp(req: Request, res: Response) {
	try {
		const { firstName, lastName, email, password, isAdmin }: IUser = req.body;
		const user: User = new User();

		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.password = hashSync(password, 15);
		user.isAdmin ??= isAdmin;

		await user.save();

		const token: unknown = await GenerateJWT(user.uId, user.isAdmin);
		SendCookie(res, token);

		return res.status(201).json({ user, token });
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}

export const LogIn = async (req: Request, res: Response) => {
	try {
		const { email, password }: IUser = req.body;

		const user: User | null = await User.findOne({
			select: [
				"uId",
				"firstName",
				"lastName",
				"email",
				"password",
				"isAdmin",
				"createdAt",
				"updatedAt",
			],
			where: { email: email },
		});

		if (!user) {
			return res.status(400).json({
				msg: "That email account doesn't exist. Enter a different account or get a new one.",
			});
		}

		const match = compareSync(password, user.password);

		if (!match) {
			return res.status(400).json({
				msg: "Your account or password is incorrect",
			});
		}

		const token: unknown = await GenerateJWT(user.uId, user.isAdmin);
		SendCookie(res, token);

		res.status(200).json({ user, token });
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
};

export async function ChangePassword(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user: User | null = await User.findOneBy({ uId: id });
		const { currentPassword, newPassword, confirmPassword } = req.body;

		if (user) {
			await UpadatePassword(id, currentPassword, newPassword, confirmPassword);
			user.password = hashSync(newPassword, 15);
			await user.save();
		}

		return res.status(200).json({
			msg: "User password updated"
		});
	} catch (error: unknown) {
		return res.status(400).json({ error });
	}
}
