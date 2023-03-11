declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SV_PORT?: number;
			DB_PORT: number;
			DB_HOST: string;
			DB_USER: string;
			DB_PASS: string;
			DB_NAME: string;
			JWT_SK: string;
		}
	}
}


export {};
