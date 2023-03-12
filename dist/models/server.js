"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("reflect-metadata");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
//import path from "path";
const db_config_1 = require("../config/db.config");
const routes_1 = require("../routes");
class Server {
    constructor() {
        this.path = {
            auth: "/auth",
            search: "/search",
            users: "/users",
        };
    }
    contructor() {
        this.app = (0, express_1.default)();
        this.PORT = 3000;
        this.dbConnection();
        this.middlewares();
        this.routes();
        this.listen();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded());
        //this.app.use(express.static(path.join(__dirname, "../public")));
    }
    async dbConnection() {
        try {
            await db_config_1.AppDataSource.initialize();
        }
        catch (error) {
            if (error instanceof Error)
                console.error(error);
        }
    }
    routes() {
        this.app.use(this.path.auth, routes_1.authRoutes);
        this.app.use(this.path.search, routes_1.searchRoutes);
        this.app.use(this.path.users, routes_1.userRoutes);
    }
    listen() {
        this.app.listen(this.PORT, () => console.log(`listening on http://localhost:${this.PORT}`));
    }
}
exports.Server = Server;
