import { Response, Request } from "express";
import bcryptjs from "bcryptjs";

import { User } from "../models";
import { generateJWT } from "../helpers";

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

		const token = await generateJWT(user.uId, user.isAdmin);

		res.status(200).json({
			user,
			token,
		});
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(400).json(error);
	}
};
