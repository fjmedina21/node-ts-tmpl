import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import fs from "fs-extra";

import { User } from "../models";
import { PhotoDelete, PhotoUpload, PhotoUpdate, ErrorHandler, } from "../helpers";

export async function GetUsers(req: Request, res: Response) {
	const { from = 0, limit = 20 } = req.query;

	try {
		const [users, total]: [User[], number] =
			await User.findAndCount({
				where: { state: true },
				order: { updatedAt: "DESC", createdAt: "DESC" },
				skip: Number(from),
				take: Number(limit),
			}) || [];

		return res.status(200).json({ result: { ok: true, total, users } });
	} catch (error: unknown) {
		if (error instanceof Error)
			return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function GetUser(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const user: User = await User.findOneByOrFail({ uId: id, state: true }) || {};

		return res.status(200).json({ result: { ok: true, user } });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}

export async function CreateUser(req: Request, res: Response) {
	const { firstName, lastName, email, password, isAdmin } = req.body;
	const file = req.files?.photo as UploadedFile;

	try {
		const user: User = new User();
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.isAdmin = Boolean(isAdmin);
		user.hashPassword(password);

		if (file) {
			await PhotoUpload(file, "users")
				.then(({ public_id, secure_url }) => { user.photo = { public_id, secure_url }; })
				.catch((reason) => { throw new Error(reason); });
		} else {
			user.photo = { public_id: "", secure_url: "" };
		}

		await user.save();
		return res.status(201).json({ result: { ok: true }, });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	} finally {
		if (file) await fs.unlink(file.tempFilePath);
	}
}

export async function UpdateUser(req: Request, res: Response) {
	const { id } = req.params;
	const { confirmPassword, photo, ...payload } = req.body;
	const file = req.files?.photo as UploadedFile;

	try {
		const user: User = await User.findOneOrFail({
			select: ["firstName", "lastName", "photo", "email", "password"],
			where: { uId: id },
		});

		if (!user.comparePassword(confirmPassword)) throw new ErrorHandler("Contraseña incorrecta", 400);

		if (file) {
			await PhotoUpdate(user.photo.public_id, file, "users")
				.then(
					async ({ public_id, secure_url }) => await User.update({ uId: id }, { photo: { public_id, secure_url } }))
				.catch((reason: ErrorHandler) => {
					throw new ErrorHandler(reason.message, reason.statusCode);
				});
		}

		await User.update({ uId: id }, payload);
		return res.status(200).json({ result: { ok: true } });
	} catch (error: unknown) {
		if (error instanceof ErrorHandler) return res.status(error.statusCode).json({ result: error.toJson() });

		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	} finally {
		if (file) await fs.unlink(file.tempFilePath);
	}
}

export async function DeleteUser(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const { photo } = await User.findOneByOrFail({ uId: id });
		if (photo.public_id) await PhotoDelete(photo.public_id);

		await User.update({ uId: id },
			{ state: false, photo: { public_id: "", secure_url: "" } }
		);

		return res.status(200).json({ result: { ok: true } });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false } });
	}
}
