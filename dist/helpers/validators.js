"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdExist = exports.IsEmail = exports.EmailExist = void 0;
const models_1 = require("../models");
async function EmailExist(email) {
    try {
        const exist = await models_1.User.findOneBy({ email: email });
        if (exist) {
            return Promise.reject("Someone already has that email address. Try another one.");
        }
    }
    catch (error) {
        //return Promise.reject(error);
    }
}
exports.EmailExist = EmailExist;
function IsEmail(email) {
    try {
        const emailRegex = /^[\w-\.]+@([\w-]+\\.)+[\w-]{2,4}$/;
        const isMatch = emailRegex.test(email);
        if (!isMatch) {
            return Promise.reject("Invalid email");
        }
    }
    catch (error) {
        //return Promise.reject(error);
    }
}
exports.IsEmail = IsEmail;
async function UserIdExist(id) {
    try {
        const exist = await models_1.User.findOneBy({ uId: id, state: true });
        if (!exist) {
            return Promise.reject("User not found");
        }
    }
    catch (error) {
        //return Promise.reject(error);
    }
}
exports.UserIdExist = UserIdExist;
