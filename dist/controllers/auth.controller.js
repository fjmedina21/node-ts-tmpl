"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogIn = exports.SignUp = void 0;
require("dotenv/config");
const bcryptjs_1 = require("bcryptjs");
const models_1 = require("../models");
const helpers_1 = require("../helpers");
function SendCookie(res, token) {
    try {
        const cookieOptions = {
            httpOnly: true,
        };
        return res.cookie("jwt", token, cookieOptions);
    }
    catch (error) {
        return;
    }
}
async function SignUp(req, res) {
    try {
        const { firstName, lastName, email, password, isAdmin } = req.body;
        const user = new models_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = (0, bcryptjs_1.hashSync)(password, 15);
        user.isAdmin ?? (user.isAdmin = isAdmin);
        await user.save();
        const token = await (0, helpers_1.GenerateJWT)(user.uId, user.isAdmin);
        SendCookie(res, token);
        return res.status(201).json({ user, token });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.SignUp = SignUp;
const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOneBy({
            email: email,
            state: true,
        });
        if (!user) {
            return res.status(400).json({
                msg: "That email account doesn't exist. Enter a different account or get a new one.",
            });
        }
        const match = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!match) {
            return res.status(400).json({
                msg: "Your account or password is incorrect",
            });
        }
        const token = await (0, helpers_1.GenerateJWT)(user.uId, user.isAdmin);
        SendCookie(res, token);
        res.status(200).json({ user, token });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
};
exports.LogIn = LogIn;
