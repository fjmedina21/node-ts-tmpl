import "reflect-metadata";

import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express, { Express } from "express";
import fileupload from "express-fileupload";

import { config, AppDataSource } from "../config";
import { UserRoutes, AuthRoutes, SearchRoutes, $404Route, HomeRoute } from "../routes";

export class Server {
	private app: Express;
	private PORT: number;
	private readonly path = {
		home: "/",
		auth: "/auth",
		users: "/users",
		search: "/search",
		$404: "/",
	};

	constructor() {
		this.app = express();
		this.PORT = config.DEV_PORT || 3000;

		this.dbConnection();
		this.middlewares();
		this.routes();
		this.listen();
	}

	private middlewares(): void {
		this.app.use(cors());
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded());
		this.app.use(express.static(path.join(__dirname, "../public")));
		this.app.use(morgan("dev"));
		this.app.use(fileupload({ useTempFiles: true }));
	}

	private async dbConnection(): Promise<void> {
		try {
			await AppDataSource.initialize();
		} catch (error: unknown) {
			console.error(error);
		}
	}

	private routes(): void {
		this.app.use(this.path.home, HomeRoute);
		this.app.use(this.path.auth, AuthRoutes);
		this.app.use(this.path.users, UserRoutes);
		this.app.use(this.path.search, SearchRoutes);
		this.app.use(this.path.$404, $404Route);
	}

	private listen(): void {
		this.app.listen(this.PORT, () =>
			console.log(`listening on http://localhost:${this.PORT}`)
		);
	}
}
