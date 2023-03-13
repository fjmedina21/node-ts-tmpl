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
const orm_config_1 = require("../config/orm.config");
const index_1 = require("../config/index");
const routes_1 = require("../routes");
class Server {
    constructor() {
        this.path = {
            auth: "/auth",
            search: "/search",
            users: "/users",
        };
        this.app = (0, express_1.default)();
        console.log(typeof process.env.DEV_PORT);
        this.PORT = index_1.config.DEV_PORT || 3000;
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
            await orm_config_1.AppDataSource.initialize();
        }
        catch (error) {
            console.error("------------------------------------------------");
            console.error(error);
            console.error("------------------------------------------------");
        }
    }
    routes() {
        this.app.use(this.path.auth, routes_1.AuthRoutes);
        this.app.use(this.path.search, routes_1.SearchRoutes);
        this.app.use(this.path.users, routes_1.UserRoutes);
    }
    listen() {
        this.app.listen(this.PORT, () => console.log(`listening on http://localhost:${this.PORT}`));
    }
}
exports.Server = Server;
