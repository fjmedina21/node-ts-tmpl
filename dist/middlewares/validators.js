"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
async function validateJWT(req, res, next) {
    try {
        const token = req.header("x-token");
        if (!token)
            return res.status(401).json({ mgs: "Token is mising" });
        const payload = jsonwebtoken_1.default.verify(token, "process.env.JWT_SK");
        const { uId } = payload;
        //Check if logged user exist
        const user = await models_1.User.findOneBy({
            uId: uId,
            state: true,
        });
        if (!user) {
            return res.status(404).json({ msg: "Invalid token" });
        }
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.validateJWT = validateJWT;
async function isAdmin(req, res, next) {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({ mgs: "Token is mising" });
        }
        const payload = jsonwebtoken_1.default.verify(token, "process.env.JWT_SK");
        const { role } = payload;
        if (!role) {
            return res.status(403).json({ msg: "action not allowed" });
        }
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.isAdmin = isAdmin;
