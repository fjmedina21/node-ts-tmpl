import 'dotenv/config';
import { DataSource } from "typeorm";
import { User } from "../models";


export const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3307,
	username: "",
	password: "",
	database: "test",
	entities: [User],
	synchronize: true,
});
