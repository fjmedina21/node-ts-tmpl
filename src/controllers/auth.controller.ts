import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs-extra";

import { User } from "../models";
import { GenerateJWT, GenerateResetJWT, ValidateResetJWT, ErrorHandler, photoUpload } from "../helpers";

export async function SignUp(req: Request, res: Response) {
	const { firstName, lastName, email, password, confirmPassword } = req.body;
	const photoFile = req.files?.photo as UploadedFile;

	try {
		const user: User = new User();
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;

		if (confirmPassword !== password) throw new ErrorHandler("Passwords unmatch", 400);
		user.hashPassword(password);

		if (photoFile) {
			await photoUpload(photoFile, "users")
				.then(({ public_id, secure_url }) => {
					user.photo = { public_id, secure_url }
				})
				.catch((reason) => {
					throw new ErrorHandler(reason,400)
				})
		}

		await user.save();
		const token = (await GenerateJWT(user.uId, user.isAdmin, user.isUser)) as string;
		return res.status(201).json({
			result: { ok: true, user, token }
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	} finally {
		if (photoFile) await fs.unlink(photoFile.tempFilePath);
	}
}

export const LogIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user: User = await User.findOneOrFail({
			select: ["uId", "firstName", "lastName", "email", "password", "isAdmin", "isUser", "state",],
			where: { email },
		});

		if (!user.state) throw new ErrorHandler("That account doesn't exist. Enter a different account or create a new one", 400);

		if (!(user.comparePassword(password))) throw new ErrorHandler("Your account or password is incorrect", 400);

		const token = await GenerateJWT(user.uId, user.isAdmin, user.isUser) as string;
		res.status(200).json({
			result: { ok: true, user, token }
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(400).json({ result: { ok: false, message: error.message } });
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
		const emailExist: User | null = await User.findOneBy({
			email,
			state: true,
		});

		if (!emailExist) throw new ErrorHandler("We don't have an account linked to that email.", 400);

		const user: User = await User.findOneByOrFail({ email, state: true });
		const resetToken = (await GenerateResetJWT(email)) as string;
		const verificationLink = `${req.protocol}://${req.header("host")}/auth/reset-password/${resetToken}`;

		await User.update({ uId: user.uId }, { resetToken });

		// TODO: enviar mail con reset token link

		return res.status(200).json({
			result: {
				ok: true,
				message: "reset link send",
				verificationLink,
			},
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function ResetPassword(req: Request, res: Response) {
	const { newPassword, confirmPassword } = req.body;
	const { resetToken } = req.params;

	try {
		const user: User = await ValidateResetJWT(resetToken);

		if (confirmPassword !== newPassword) throw new ErrorHandler("Password unmatch", 400);

		await User.update({ uId: user.uId }, {
			password: user.hashPassword(confirmPassword),
			resetToken: ""
		});
		return res.status(200).json({
			result: {
				ok: true,
				message: "Password changed",
			},
		});
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}
