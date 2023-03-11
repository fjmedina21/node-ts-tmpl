import { User } from "../models";
//import { CustomValidator } from 'express-validator';

export async function emailExist(email: string) {
	const exist: User | null = await User.findOneBy({ email: email });

	if (exist) {
		return Promise.reject(
			"Someone already has that email address. Try another one."
		);
	}
}

export function isEmail(email: string) {
	const emailRegex = /^[\w-\.]+@([\w-]+\\.)+[\w-]{2,3}$/;

	const isMatch = emailRegex.test(email);

	if (!isMatch) {
		return Promise.reject("Invalid email");
	}
}

export async function userIdExist(id: string) {
	const exist: User | null = await User.findOneBy({ uId: id, state: true });

	if (!exist) {
		return Promise.reject("User not found");
	}
}
