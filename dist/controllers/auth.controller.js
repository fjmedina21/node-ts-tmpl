"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = exports.LogIn = exports.SignUp = void 0;
require("dotenv/config");
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
        user.hashPassword(password);
        user.isAdmin = isAdmin;
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
        const user = await models_1.User.findOne({
            select: [
                "uId",
                "firstName",
                "lastName",
                "email",
                "password",
                "isAdmin",
                "createdAt",
                "updatedAt",
            ],
            where: { email },
        });
        if (!user) {
            return res.status(400).json({
                message: "That email account doesn't exist. Enter a different account or get a new one."
            });
        }
        const match = user.comparePassword(password);
        if (!match) {
            return res.status(400).json({
                message: "Your account or password is incorrect",
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
async function ChangePassword(req, res) {
    try {
        const { id } = req.params;
        const user = await models_1.User.findOneBy({ uId: id });
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (user) {
            await (0, helpers_1.UpadatePassword)(id, currentPassword, newPassword, confirmPassword);
            user.hashPassword(newPassword);
            await user.save();
        }
        return res.status(200).json({
            message: "User password updated",
        });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.ChangePassword = ChangePassword;
