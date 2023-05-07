import dotenv from "dotenv/config";
dotenv;

export const config = {
	DEV_PORT: Number(process.env.DEV_PORT),

	DB_HOST: process.env.DB_HOST,
	DB_PORT: Number(process.env.DB_PORT),
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_NAME: process.env.DB_NAME,

	JWT_SECRECT: "9%W@3s8Lh4Rn",
	JWT_SESSION_EXPIRES_IN: process.env.JWT_SESSION_EXPIRES_IN,
	JWT_RESET_TOKEN_SECRECT: "3A8f^ZRns398",
	JWT_RESET_TOKEN_EXPIRES_IN: process.env.JWT_RESET_TOKEN_EXPIRES_IN,

	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
	CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
	CLOUDINARY_KEY: process.env.CLOUDINARY_KEY
};

export { };
