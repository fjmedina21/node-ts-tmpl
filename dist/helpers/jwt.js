"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJWT(uId) {
    return new Promise((resolve, reject) => {
        const payload = { uId };
        jsonwebtoken_1.default.sign(payload, "secrect-key", { expiresIn: "4h" }, (error, token) => {
            if (error instanceof Error)
                reject(error);
            else
                resolve(token);
        });
    });
}
exports.generateJWT = generateJWT;
