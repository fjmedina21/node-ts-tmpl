"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function isAdmin(req, res, next) {
    try {
        const token = req.header("x-token");
        if (!token)
            return res.status(401).json({ mgs: "Token is mising" });
        const payload = jsonwebtoken_1.default.verify(token, "secrect-key");
        const { role } = payload;
        if (!role) {
            return res.status(403).json({ message: "action not allowed" });
        }
        next();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
    next();
}
exports.isAdmin = isAdmin;
