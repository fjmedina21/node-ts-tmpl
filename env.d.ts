import { Secret } from "jsonwebtoken";
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_SK: Secret;
			JWT_EXPIRES_IN: string;
			JWT_COOKIE_EXPIRES_IN_DAY: string;
			//--------------
			DEV_PORT: number;
			//--------------
			DB_PORT: number;
			DB_HOST: string;
			DB_USER: string;
			DB_PASS: string;
			DB_NAME: string;
			//--------------
		}

	}
}

export {};
