import { User } from "../models";

export async function EmailExist(email: string) {
	try {
		const exist: User | null = await User.findOneBy({ email: email });

		if (exist) {
			return Promise.reject(
				"Someone already has that email address. Try another one."
			);
		}
	} catch (error: unknown) {
		//return Promise.reject(error);
	}
}

export function IsEmail(email: string) {
	try {
		const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\\.)+[\w-]{2,4}$/;

		const isMatch = emailRegex.test(email);

		if (!isMatch) {
			return Promise.reject("Invalid email");
		}
	} catch (error: unknown) {
		//return Promise.reject(error);
	}
}

export async function UserIdExist(id: string) {
	try {
		const exist: User | null = await User.findOneBy({ uId: id, state: true });

		if (!exist) {
			return Promise.reject("User not found");
		}
	} catch (error: unknown) {
		//return Promise.reject(error);
	}
}
