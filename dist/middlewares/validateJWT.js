"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
async function validateJWT(req, res, next) {
    try {
        const token = req.header("x-token");
        if (!token)
            return res.status(401).json({ mgs: "Token is mising" });
        const payload = jsonwebtoken_1.default.verify(token, "secrect-key");
        const { uId } = payload;
        //Check if logged user exist
        const user = await models_1.User.findOneBy({
            uId: uId,
            state: true,
        });
        if (!user) {
            return res.status(404).json({ message: "user not found!" });
        }
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.validateJWT = validateJWT;
