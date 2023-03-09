import { CustomValidator } from "express-validator";
import { User } from "../models";

export const emailExist: CustomValidator = async (email: string) => {
	// check if email already in db
	const exist: User | null = await User.findOneBy({ email: email });

	if (exist) {
		return Promise.reject(
			"Someone already has this email address. Try another one."
		);
	}
};

export const userIdExist: CustomValidator = async (id: string) => {
	// check if user in db
	const exist: User | null = await User.findOneBy({ uId: id, state: true });

	if (!exist) {
		return Promise.reject("User not found");
	}
};
