import { Response, Request } from "express";
import { Like } from "typeorm";

import { User } from "../models/";

export async function Search(req: Request, res: Response) {
	try {
		const { term } = req.params;

		const isUUID: boolean = false; // TODO: validate if term is UUID

		if (isUUID) {
			const user: User = await User.findOneByOrFail({
				uId: term,
				state: true,
			});
			return res.status(200).json({
				result: user ? [user] : [],
			});
		} else if (!isUUID) {
			const user: [User[], number] = await User.findAndCount({
				where: [
					{ state: true, firstName: Like(`%${term}%`) },
					{ state: true, lastName: Like(`%${term}%`) },
				],
			});

			return res.status(200).json({
				total: user[1],
				results: user[0],
			});
		}
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
