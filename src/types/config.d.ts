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
			JWT_RESET_SECRECT: string;
			JWT_EXPIRES_IN: string;
			JWT_COOKIE_EXPIRES_IN: string;
		}
	}
}

export {};
