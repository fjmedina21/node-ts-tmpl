"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    //SEVER PORTS
    DEV_PORT: 8080,
    //DATABASE
    DB_HOST: "localhost",
    DB_PORT: 3307,
    DB_USER: "root",
    DB_PASS: "",
    DB_NAME: "api_nodets",
    //JWT
    JWT_SECRECT: "pr1V@t3K3y",
    JWT_RESET_SECRECT: "r3S3Tpr1V@t3K3y",
    JWT_EXPIRES_IN: "1d",
    JWT_COOKIE_EXPIRES_IN_DAY: 1,
};
