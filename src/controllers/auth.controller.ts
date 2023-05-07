import { Response, Request } from "express";

import { User } from "../models";
import { GenerateJWT, ErrorHandler, GenerateResetJWT, ValidateResetJWT } from "../helpers";

export async function SignUp(req: Request, res: Response) {
	const { firstName, lastName, email, password, confirmPassword } = req.body;

	try {
		const user: User = new User();

		user.firstName = firstName;
		user.lastName = lastName;
		user.email = String(email).toLowerCase();
		if (confirmPassword !== password) throw new ErrorHandler("Contraseñas no coinciden", 400);
		user.hashPassword(password);
		user.photo = { public_id: "", secure_url: "" };
		await user.save();

		return res.status(201).json({ result: { ok: true } });
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export const LogIn = async (req: Request, res: Response) => {
	const { email } = req.body;
	const normalizedEmail = String(email).toLowerCase();

	try {
		const user: User | null = await User.findOne({
			select: ["uId", "firstName", "lastName", "email", "photo", "password", "isAdmin", "isUser", "state"], where: { email: normalizedEmail }
		});

		if (!user || !user.state) throw new ErrorHandler("Esta cuenta no esta registrada. Ingresa otra diferente o crea una nueva", 400);

		const { password, state, isAdmin, isUser, ...data } = user;

		if (!user.comparePassword(req.body.password)) throw new ErrorHandler("Credenciales incorrectas", 400);

		const token = (await GenerateJWT(data.uId, isAdmin, isUser)) as string;
		res.status(200).json({ result: { ok: true, user: data, token } });
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

		if (!user.comparePassword(currentPassword)) throw new ErrorHandler("Contraseña actual incorrecta", 400);
		if (user.comparePassword(newPassword)) throw new ErrorHandler("Nueva contraseña debe ser diferente", 400);
		if (confirmPassword !== newPassword) throw new ErrorHandler("Contraseñas no coinciden", 400);

		await User.update({ uId: id }, { password: user.hashPassword(newPassword) });
		return res.status(200).json({ result: { ok: true, message: "Contraseña actualizada" } });
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
		const passwordRecoverLink = `${req.protocol}://${req.header("host")}/auth/reset-password/${resetToken}`;

		await User.update({ uId: user.uId }, { resetToken });

		// TODO: enviar mail con reset token link

		return res.status(200).json({
			result: {
				ok: true,
				message: `Enlace de recuperación enviado a ${email}`,
				passwordRecoverLink,
			},
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: "Lo sentimos pero esta cuenta no esta registrada." } });
	}
}

export async function ResetPassword(req: Request, res: Response) {
	const { newPassword, confirmPassword } = req.body;
	const { resetToken } = req.params;

	try {
		const user: User | null = await ValidateResetJWT(resetToken);

		if (confirmPassword !== newPassword) throw new ErrorHandler("Contraseñas no coinciden", 400);
		else if (!user) throw new ErrorHandler("Enlace inválido", 400);

		await User.update({ uId: user.uId }, {
			password: user.hashPassword(newPassword),
			resetToken: ""
		});

		return res.status(200).json({ result: { ok: true, message: "Contraseña restablecida" }, });
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}
