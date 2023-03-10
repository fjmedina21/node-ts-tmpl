import jwt from "jsonwebtoken";

export function generateJWT(uId: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const payload: object = { uId };

		jwt.sign(
			payload,
			"secrect-key",
			{ expiresIn: "4h" },
			(error: unknown, token: string | undefined) => {
				if (error instanceof Error) reject(error);
				else resolve(token);
			}
		);
	});
}
