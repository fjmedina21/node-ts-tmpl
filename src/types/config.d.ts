declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DEV_PORT: number;
			DB_PORT: number;
			DB_HOST: string;
			DB_USER: string;
			DB_PASS: string;
			DB_NAME: string;

			JWT_SECRECT: string;
			JWT_SESSION_EXPIRES_IN: string;
			JWT_RESET_TOKEN_SECRECT: string;
			JWT_RESET_TOKEN_EXPIRES_IN: string;
			CLOUDINARY_URL: string;
		}
	}
}

export { };
