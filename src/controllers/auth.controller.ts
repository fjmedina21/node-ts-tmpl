import { Response, Request } from "express";

import { User, IUser } from "../models";
import { GenerateJWT, GenerateResetJWT, ValidateResetJWT, ErrorHandler } from "../helpers";

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

		return res.status(201).json({
			result: { ok: true, user, token }
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
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

		if (!user.state) throw new Error();

		if (!(user.comparePassword(password))) throw new ErrorHandler("Your account or password is incorrect", 400);

		const roles = { isAdmin: user.isAdmin, isUser: user.isUser } as IUser;
		const token = await GenerateJWT(user.uId, roles) as string

		res.status(200).json({
			result: { ok: true, user, token }
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(400).json({ result: { ok: false, message: "That account doesn't exist. Enter a different account or create a new one" } });
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

		if (!user.comparePassword(currentPassword)) throw new Error("Incorrect current password");
		if (user.comparePassword(newPassword)) throw new Error("New password can't be the same");
		if (confirmPassword !== newPassword) throw new Error("Passwords unmatch");

		user.hashPassword(confirmPassword);
		await user.save();

		return res.status(200).json({
			result: {
				ok: true,
				message: "Passwor updated",
			},
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function ForgotPassword(req: Request, res: Response) {
	try {
		const { email }: IUser = req.body;

		const emailExist: User | null = await User.findOneBy({
			email,
			state: true,
		});

		if (!emailExist) throw new Error("This email account doesn't exist");

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
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function ResetPassword(req: Request, res: Response) {
	try {
		const { newPassword, confirmPassword } = req.body;
		const { resetToken } = req.params;

		const user: User = await ValidateResetJWT(resetToken);

		if (confirmPassword !== newPassword) throw new ErrorHandler("This email account doesn't exist", 400);

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
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}
