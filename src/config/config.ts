import "dotenv/config";

export const config = {
	DEV_PORT: 8080,

	DB_HOST: "localhost",
	DB_PORT: 3307,
	DB_USER: "root",
	DB_PASS: "",
	DB_NAME: "test",

	JWT_SECRECT: "9%W@3s8Lh4Rn",
	JWT_SESSION_EXPIRES_IN: "3h",
	JWT_RESET_TOKEN_SECRECT: "3A8f^ZRns398",
	JWT_RESET_TOKEN_EXPIRES_IN: "10m",
	CLOUDINARY_URL: "cloudinary://468217321751245:TOQrIGdU6h6RmaTbdH41FqXFagg@fjmedina"
};

export { };
