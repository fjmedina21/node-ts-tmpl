import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "../models";
import { config } from "./index";

export const AppDataSource = new DataSource({
	type: "mysql",
	host: config.DB_HOST,
	port: config.DB_PORT,
	username: config.DB_USER,
	password: config.DB_PASS,
	database: config.DB_NAME,
	entities: [User],
	synchronize: true,
});
