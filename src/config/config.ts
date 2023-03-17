import "dotenv/config";

export const config = {
	DEV_PORT:  8080,

	DB_HOST: "localhost",
	DB_PORT: 3307,
	DB_USER: "root",
	DB_PASS: "",
	DB_NAME: "api_nodets",

	JWT_SECRECT: "pr1V@t3K3y",
	JWT_SESSION_EXPIRES_IN: "5h",
	JWT_RESET_TOKEN_SECRECT: "pr1V@t3K3yr3sEtT0k3n",
	JWT_RESET_TOKEN_EXPIRES_IN: "10m",
};

export { };
