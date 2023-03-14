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
		return Promise.reject(error);
	}
}

export async function UserIdExist(id: string) {
	try {
		const exist: User | null = await User.findOneBy({ uId: id, state: true });

		if (!exist) {
			return Promise.reject("User not found");
		}
	} catch (error: unknown) {
		return Promise.reject(error);
	}
}

// TODO: implement personalized EMAIL validation
/*export function IsEmail(email: string) {
	try {
		const emailRegex: RegExp =
			/^([\w\d])+@(?:[[:alpha:]]{3,15}\.)+[a-z]{2,4}$/gi;

		const isMatch = emailRegex.test(email);

		if (!isMatch) {
			return Promise.reject("Invalid email");
		}
	} catch (error: unknown) {
		//return Promise.reject(error);
	}
}*/

// TODO: implement personalized UUID validation
/*export function IsUUID(uuid: string) {
	try {
		//55f91b4d-f8f5-400a-9f3e-1ad0b984ffbf
		const uuidRegex: RegExp =
			/^[A-F\d]{8}-[A-F\d]{4}-[A-F\d]{4}-[A-F\d]{4}-[A-F\d]{12}$/i;

		const isMatch = uuid.match(uuidRegex);

		if (!isMatch) return Promise.reject("Invalid uuid");
	} catch (error: unknown) {
		//return Promise.reject(error);
	}
}*/
