import { DataSource } from "typeorm";

import { User } from "../models/user.model";
import { config } from ".";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: config.DB_HOST,
	port: config.DB_PORT,
	username: config.DB_USER,
	password: config.DB_PASS,
	database: config.DB_NAME,
	logging: ["error"],
	logger: "file",
	entities: [User],
	synchronize: true, //remove in prod
});
