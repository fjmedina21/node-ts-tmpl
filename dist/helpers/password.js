"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword = void 0;
const models_1 = require("../models");
const bcryptjs_1 = require("bcryptjs");
async function ChangePassword(uId, pR, nP, cP) {
    //pR:password registered, nP:new password, cP:confirm password
    await CheckCurrentPass(uId, pR);
    await CheckNewPass(pR, nP);
    await ConfirmPass(nP, cP);
}
exports.ChangePassword = ChangePassword;
async function CheckCurrentPass(id, currentPassword) {
    try {
        const user = await models_1.User.findOneBy({ uId: id });
        if (user) {
            const match = (0, bcryptjs_1.compareSync)(currentPassword, user.password);
            if (!match) {
                // check that current and user.Pass are the same
                return Promise.reject({
                    msg: "Invalid password",
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
            // Check that current and new Pass are the same
            return Promise.reject({
                msg: "Current and New Password can't be the same",
                fields: "currentPassword, newPassword",
            });
        }
    }
    catch (error) {
        return error;
    }
}
async function ConfirmPass(newPass, confirmPass) {
    try {
        if (confirmPass !== newPass) {
            // Check that new and confirm pass are the same
            return Promise.reject({
                msg: "These passwords don't match",
                fields: "newPassword, confirmPass",
            });
        }
    }
    catch (error) {
        return error;
    }
}
