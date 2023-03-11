"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdExist = exports.isEmail = exports.emailExist = void 0;
const models_1 = require("../models");
//import { CustomValidator } from 'express-validator';
async function emailExist(email) {
    const exist = await models_1.User.findOneBy({ email: email });
    if (exist) {
        return Promise.reject("Someone already has that email address. Try another one.");
    }
}
exports.emailExist = emailExist;
function isEmail(email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\\.)+[\w-]{2,3}$/;
    const isMatch = emailRegex.test(email);
    if (!isMatch) {
        return Promise.reject("Invalid email");
    }
}
exports.isEmail = isEmail;
async function userIdExist(id) {
    const exist = await models_1.User.findOneBy({ uId: id, state: true });
    if (!exist) {
        return Promise.reject("User not found");
    }
}
exports.userIdExist = userIdExist;
