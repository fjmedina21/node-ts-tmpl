import { Response, Request } from "express";

import { User } from "../models";
import { GenerateJWT, ErrorHandler, GenerateResetJWT, ValidateResetJWT } from "../helpers";

export async function SignUp(req: Request, res: Response) {
	const { firstName, lastName, email, password, confirmPassword } = req.body;

	try {
		const user: User = new User();

		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		if (confirmPassword !== password) throw new ErrorHandler("Passwords unmatch", 400);
		user.hashPassword(password);
		user.photo = { public_id: "", secure_url: "" };
		await user.save();

		return res.status(201).json({
			result: { ok: true, message: "signed up" }
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export const LogIn = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		const user: User | null = await User.findOne({
			select: ["uId", "firstName", "lastName", "email", "password", "isAdmin", "isUser", "state"], where: { email }
		});

		if (!user || !user.state) throw new ErrorHandler("That account doesn't exist. Enter a different account or create a new one", 400);

		const { password, state, isAdmin, isUser, ...data } = user;

		if (!user.comparePassword(req.body.password)) throw new ErrorHandler("Your account or password is incorrect", 400);

		const token = (await GenerateJWT(data.uId, isAdmin, isUser)) as string;
		res.status(200).json({
			result: { ok: true, user: data, token }
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
};

export async function ChangePassword(req: Request, res: Response) {
	const { id } = req.params;
	const { currentPassword, newPassword, confirmPassword } = req.body;

	try {
		const user: User = await User.findOneOrFail({
			select: ["password"],
			where: { uId: id },
		});

		if (!user.comparePassword(currentPassword)) throw new ErrorHandler("Incorrect current password", 400);
		if (user.comparePassword(newPassword)) throw new ErrorHandler("New password can't be the same", 400);
		if (confirmPassword !== newPassword) throw new ErrorHandler("Passwords unmatch", 400);

		await User.update({ uId: id }, { password: user.hashPassword(confirmPassword) });
		return res.status(200).json({ result: { ok: true, message: "Password updated" } });
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function ForgotPassword(req: Request, res: Response) {
	const { email } = req.body;

	try {
		const user: User = await User.findOneByOrFail({ email, state: true });
		const resetToken = (await GenerateResetJWT(email)) as string;
		const verificationLink = `${req.protocol}://${req.header("host")}/auth/reset-password/${resetToken}`;

		await User.update({ uId: user.uId }, { resetToken });

		// TODO: enviar mail con reset token link

		return res.status(200).json({
			result: {
				ok: true,
				message: `Reset link send to ${email}`,
				verificationLink,
			},
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: "That account doesn't exist. Try another or create a new one " } });
	}
}

export async function ResetPassword(req: Request, res: Response) {
	const { newPassword, confirmPassword } = req.body;
	const { resetToken } = req.params;

	try {
		const user: User | null = await ValidateResetJWT(resetToken);
		if (confirmPassword !== newPassword) throw new ErrorHandler("Password unmatch", 400);
		else if (!user) throw new ErrorHandler("Invalid token", 400);

		await User.update({ uId: user.uId }, {
			password: user.hashPassword(newPassword),
			resetToken: ""
		});

		return res.status(200).json({ result: { ok: true, message: "Password reset" }, });
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}
