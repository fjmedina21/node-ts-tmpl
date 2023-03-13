"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateJWT = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function GenerateJWT(uId, isAdmin) {
    return new Promise((resolve, reject) => {
        const payload = { uId, isAdmin };
        jsonwebtoken_1.default.sign(payload, "process.env.JWT_SK", { expiresIn: process.env.JWT_EXPIRES_IN }, (error, token) => {
            if (error)
                reject(error);
            else
                resolve(token);
        });
    });
}
exports.GenerateJWT = GenerateJWT;
