import { Response, Request } from "express";
import { Like } from "typeorm";

import { User } from "../models";

export async function Search(req: Request, res: Response) {
	const { term } = req.params;

	try {
		const isUUID: boolean = false; // TODO: validate if term is UUID

		if (isUUID) {
			const user: User = await User.findOneByOrFail({ uId: term, state: true });
			return res.status(200).json({ result: user ? [user] : [] });
		}
		
		const [users, total] = await User.findAndCount({
			where: [
				{ state: true, firstName: Like(`%${term}%`) },
				{ state: true, lastName: Like(`%${term}%`) },
			],
		});

		return res.status(200).json({ total, results: users });
	} catch (error: unknown) {
		if (error instanceof Error) return res.status(500).json({ result: { ok: false, message: error.message } });
	}
}
