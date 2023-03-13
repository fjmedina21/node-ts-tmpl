import { User } from "../models";
import { compareSync } from "bcryptjs";

export async function UpadatePassword(
	uId: string,
	current: string,
	newPass: string,
	confirmPass: string
) {
	// check that current is correct
	await CheckCurrent(uId, current);

	// Check that current and new Pass are not the same
	await CheckNewPass(current, newPass);
	
	// Check that new and confirm pass are the same
	await ConfirmNewPass(newPass, confirmPass);
}

async function CheckCurrent(id: string, currentPassword: string) {
	try {
		const user: User | null = await User.findOne({
			select: ["uId", "password"],
			where: { uId: id },
		});

		if (user) {
			const match = compareSync(currentPassword, user.password);
			if (!match) {
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
			return Promise.reject({
				msg: "Current and New Password can't be the same",
				fields: "currentPassword, newPassword",
			});
		}
	} catch (error: unknown) {
		return error;
	}
}

async function ConfirmNewPass(newPass: string, confirmPass: string) {
	try {
		if (confirmPass !== newPass) {
			return Promise.reject({
				msg: "These passwords don't match",
				fields: "newPassword, confirmPass",
			});
		}
	} catch (error: unknown) {
		return error;
	}
}
