import "reflect-metadata";
import "dotenv/config";

import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
//import path from "path";

import { AppDataSource } from "../config/orm.config";
import { config } from "../config/index";
import { UserRoutes, AuthRoutes, SearchRoutes } from "../routes";

export class Server {
	private app: Express;
	private PORT: number;
	private readonly path = {
		auth: "/auth",
		search: "/search",
		users: "/users",
	};

	constructor() {
		this.app = express();
		console.log(typeof process.env.DEV_PORT);
		this.PORT = config.DEV_PORT || 3000;

		this.dbConnection();
		this.middlewares();
		this.routes();
		this.listen();
	}

	private middlewares(): void {
		this.app.use(cors());
		this.app.use(morgan("dev"));
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded());
		//this.app.use(express.static(path.join(__dirname, "../public")));
	}

	private async dbConnection(): Promise<void> {
		try {
			await AppDataSource.initialize();
		} catch (error: unknown) {
			console.error("------------------------------------------------");
			console.error(error);
			console.error("------------------------------------------------");
		}
	}

	private routes(): void {
		this.app.use(this.path.auth, AuthRoutes);
		this.app.use(this.path.search, SearchRoutes);
		this.app.use(this.path.users, UserRoutes);
	}

	private listen(): void {
		this.app.listen(this.PORT, () =>
			console.log(`listening on http://localhost:${this.PORT}`)
		);
	}
}
