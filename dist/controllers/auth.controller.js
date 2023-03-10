"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const helpers_1 = require("../helpers");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOneBy({ email: email, state: true });
        if (!user) {
            return res.status(400).json({
                msg: "please check your credentials and try again.",
            });
        }
        const match = bcryptjs_1.default.compareSync(password, user.password);
        if (!match) {
            return res.status(400).json({
                msg: "please check your credentials and try again.",
            });
        }
        const token = await (0, helpers_1.generateJWT)(user.uId);
        res.status(200).json({
            user,
            token,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
};
exports.login = login;
