export const config = {
	//SEVER PORTS
	DEV: 8080,

	//DATABASE
	DB_HOST: "localhost",
	DB_PORT: 3307,
	DB_USER: "root",
	DB_PASS: "",
	DB_NAME: "api_nodets",

	//JWT
	JWT_SECRECT: "pr1V@t3K3y",
	JWT_SESSION_EXPIRES_IN: "4h",
	JWT_RESET_TOKEN_SECRECT: "pr1V@t3K3yr3sEtT0k3n",
	JWT_RESET_TOKEN_EXPIRES_IN: "10m",
	JWT_COOKIE_EXPIRES_IN_DAY: 1 * 86400000 // --> 24h*60min*60s*1000ms => 86,400,000ms => 1d
};

export {};
