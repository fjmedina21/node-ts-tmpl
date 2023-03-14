import { Response, Request, CookieOptions } from "express";

import { config } from "../config/index";
import { User, IUser } from "../models";
import { GenerateJWT, GenerateResetJWT, ValidateResetJWT } from "../helpers";

function SetCookie(res: Response, name: string, token: unknown) {
	try {
		const now: number = new Date().getTime();
		const expires = new Date(now + config.JWT_COOKIE_EXPIRES_IN_DAY);

		const cookieOptions: CookieOptions = {
			httpOnly: true,
			expires,
		};

		//res.clearCookie(name);
		return res.cookie(name, token, cookieOptions);
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
		user.hashPassword(password);
		user.isAdmin = isAdmin;
		await user.save();

		const roles = { isAdmin: user.isAdmin, isUser: user.isUser } as IUser;
		const token = (await GenerateJWT(user.uId, roles)) as string;
		//res.setHeader("auth", token);
		SetCookie(res, "login", token);

		return res.status(201).json({
			result: {
				ok: true,
				user,
				token,
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

export const LogIn = async (req: Request, res: Response) => {
	try {
		const { email, password }: IUser = req.body;

		const user: User = await User.findOneOrFail({
			select: [
				"uId",
				"firstName",
				"lastName",
				"email",
				"password",
				"isAdmin",
				"isUser",
				"state",
			],
			where: { email },
		});

		if (!user.state) {
			return res.status(400).json({
				result: {
					ok: false,
					message:
						"Account not registered. Enter a different account or get a new one.",
				},
			});
		}

		const match: boolean = user.comparePassword(password);

		if (!match) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Your account or password is incorrect",
				},
			});
		}

		const roles = { isAdmin: user.isAdmin, isUser: user.isUser } as IUser;
		const token: unknown = await GenerateJWT(user.uId, roles);
		SetCookie(res, "login", token);

		res.status(200).json({
			result: {
				ok: true,
				user,
				token,
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
};

export async function ChangePassword(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { currentPassword, newPassword, confirmPassword } = req.body;

		const user: User = await User.findOneOrFail({
			select: ["password"],
			where: { uId: id },
		});

		if (!user.comparePassword(currentPassword)) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Incorrect current password",
				},
			});
		}

		if (user.comparePassword(newPassword)) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "New password can't be the same",
				},
			});
		}

		if (confirmPassword !== newPassword) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Passwords unmatch",
				},
			});
		}

		user.hashPassword(confirmPassword);
		await user.save();

		return res.status(200).json({
			result: {
				ok: true,
				message: "Passwor updated",
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

export async function ForgotPassword(req: Request, res: Response) {
	try {
		const { email }: IUser = req.body;

		const emailExist: User | null = await User.findOneBy({ email, state:true });

		if (!emailExist) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "This email account doesn't exist",
				},
			});
		}

		const user: User = await User.findOneByOrFail({ email, state: true });
		const resetToken = (await GenerateResetJWT(email)) as string;
		const verificationLink = `${req.protocol}://${req.header(
			"host"
		)}/auth/reset-password/${resetToken}`;

		user.resetToken = resetToken;
		await user.save();

		// TODO: enviar mail con reset token link

		return res.status(200).json({
			result: {
				ok: true,
				message: "reset link emailed",
				verificationLink,
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

export async function ResetPassword(req: Request, res: Response) {
	try {
		const { newPassword, confirmPassword } = req.body;
		const { resetToken } = req.params;

		const user: User = await ValidateResetJWT(resetToken);

		if ((confirmPassword !== newPassword)) {
			return res.status(400).json({
				result: {
					ok: false,
					message: "Passwords unmatch",
				},
			});
		}

		user.hashPassword(confirmPassword);
		user.resetToken = "";
		await user.save();

		return res.status(200).json({
			result: {
				ok: true,
				message: "Passwords set",
			},
		});
	} catch (error: unknown) {
		if (error instanceof Error)
			error = {
				ok: false,
				name: "Invalid token",
				message: "Token already used",
			};
		return res.status(500).json({ error });
	}
}
