import { User } from "../models";

export interface IPassword {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

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

async function CheckCurrent(uId: string, currentPassword: string) {
	try {
		const user: User | null = await User.findOne({
			select: ["uId", "password"],
			where: { uId },
		});

		if (user) {
			const match = user.comparePassword(currentPassword);
			if (!match) {
				return Promise.reject({
					message: "Invalid password",
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
				message: "Current and New Password can't be the same",
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
				message: "These passwords don't match",
				fields: "newPassword, confirmPass",
			});
		}
	} catch (error: unknown) {
		return error;
	}
}
