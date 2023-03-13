import { User } from "../models";
import { compareSync } from "bcryptjs";

export async function ChangePassword(
	uId: string,
	pR: string,
	nP: string,
	cP: string
) {
	//pR:password registered, nP:new password, cP:confirm password
	
	await CheckCurrentPass(uId, pR);
	await CheckNewPass(pR, nP);
	await ConfirmPass(nP, cP);
}

async function CheckCurrentPass(id: string, currentPassword: string) {
	try {
		const user: User | null = await User.findOneBy({ uId: id });

		if (user) {
			const match = compareSync(currentPassword, user.password);
			if (!match) {
				// check that current and user.Pass are the same
				return Promise.reject({
					msg: "Invalid password",
					field: "currentPassword",
				});
			}
		}
	} catch (error: unknown) {
		return error;
	}
}

async function CheckNewPass(currentPass: string, newPass: string) {
	try {
		if (currentPass === newPass) {
			// Check that current and new Pass are the same
			return Promise.reject({
				msg: "Current and New Password can't be the same",
				fields: "currentPassword, newPassword",
			});
		}
	} catch (error: unknown) {
		return error;
	}
}

async function ConfirmPass(newPass: string, confirmPass: string) {
	try {
		if (confirmPass !== newPass) {
			// Check that new and confirm pass are the same
			return Promise.reject({
				msg: "These passwords don't match",
				fields: "newPassword, confirmPass",
			});
		}
	} catch (error: unknown) {
		return error;
	}
}
