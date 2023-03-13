"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpadatePassword = void 0;
const models_1 = require("../models");
async function UpadatePassword(uId, current, newPass, confirmPass) {
    // check that current is correct
    await CheckCurrent(uId, current);
    // Check that current and new Pass are not the same
    await CheckNewPass(current, newPass);
    // Check that new and confirm pass are the same
    await ConfirmNewPass(newPass, confirmPass);
}
exports.UpadatePassword = UpadatePassword;
async function CheckCurrent(uId, currentPassword) {
    try {
        const user = await models_1.User.findOne({
            select: ["uId", "password"],
            where: { uId },
        });
        if (user) {
            const match = user.comparePassword(currentPassword);
            if (!match) {
                return Promise.reject({
                    message: "Invalid password",
                    field: "currentPassword",
                });
            }
        }
    }
    catch (error) {
        return error;
    }
}
async function CheckNewPass(currentPass, newPass) {
    try {
        if (currentPass === newPass) {
            return Promise.reject({
                message: "Current and New Password can't be the same",
                fields: "currentPassword, newPassword",
            });
        }
    }
    catch (error) {
        return error;
    }
}
async function ConfirmNewPass(newPass, confirmPass) {
    try {
        if (confirmPass !== newPass) {
            return Promise.reject({
                message: "These passwords don't match",
                fields: "newPassword, confirmPass",
            });
        }
    }
    catch (error) {
        return error;
    }
}
