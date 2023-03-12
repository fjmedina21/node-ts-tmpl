"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJWT(uId, role) {
    return new Promise((resolve, reject) => {
        const payload = { uId, role };
        jsonwebtoken_1.default.sign(payload, "process.env.JWT_SK", { expiresIn: "2h" }, (error, token) => {
            if (error instanceof Error)
                reject(error);
            else
                resolve(token);
        });
    });
}
exports.generateJWT = generateJWT;
