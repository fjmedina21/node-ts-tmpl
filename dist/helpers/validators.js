"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdExist = exports.emailExist = void 0;
const models_1 = require("../models");
const emailExist = async (email) => {
    // check if email already in db
    const exist = await models_1.User.findOneBy({ email: email });
    if (exist) {
        return Promise.reject("Someone already has that email address. Try another one.");
    }
};
exports.emailExist = emailExist;
const userIdExist = async (id) => {
    // check if user in db
    const exist = await models_1.User.findOneBy({ uId: id, state: true });
    if (!exist) {
        return Promise.reject("User not found");
    }
};
exports.userIdExist = userIdExist;
