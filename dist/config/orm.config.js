"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
const index_1 = require("./index");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: index_1.config.DB_HOST,
    port: index_1.config.DB_PORT,
    username: index_1.config.DB_USER,
    password: index_1.config.DB_PASS,
    database: index_1.config.DB_NAME,
    entities: [models_1.User],
    synchronize: true,
});
