import "dotenv/config";

import { Response, Request } from "express";
import bcryptjs from "bcryptjs";

import { User } from "../models";
import { generateJWT } from "../helpers";

function sendCookie(res: Response, token: unknown): void {
	const cookieOptions: object = {
		expires: Date() + (process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000),
		httpOnly: true,
	};

	res.cookie("jwt", token, cookieOptions);
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOneBy({ email: email, state: true });
		if (!user) {
			return res.status(400).json({
				msg: "please check your credentials and try again.",
			});
		}

		const match = bcryptjs.compareSync(password, user.password);
		if (!match) {
			return res.status(400).json({
				msg: "please check your credentials and try again.",
			});
		}

		const token: unknown = await generateJWT(user.uId, user.isAdmin);
		//sendCookie(res, token);

		res.status(200).json({ user, token });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
};

export async function signup(req: Request, res: Response) {
	try {
		const { firstName, lastName, email, password, isAdmin } = req.body;
		const user: User = new User();

		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.isAdmin = isAdmin;

		//Encriptar la contraseña
		user.password = bcryptjs.hashSync(password, 15);

		await user.save();

		const token = await generateJWT(user.uId, user.isAdmin);
		//sendCookie(res, token);

		return res.status(201).json({ user, token });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json({ error });
	}
}
