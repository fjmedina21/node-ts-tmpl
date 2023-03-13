import { Response, Request } from "express";
import { Like } from "typeorm";
import { User } from "../models/";

export async function Search(req: Request, res: Response) {
	try {
		const { term } = req.params;

		const isUUID: boolean = false; // TODO: validate if term is UUID

		if (isUUID) {
			const user: User | null = await User.findOneBy({
				uId: term,
				state: true,
			});
			return res.status(200).json({
				results: user ? [user] : [],
			});
		} else if (!isUUID) {
			const user = await User.findAndCount({
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
		return res.status(400).json({ error });
	}
}
