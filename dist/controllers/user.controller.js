"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDelete = exports.userPut = exports.userPost = exports.userGetById = exports.usersGet = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const helpers_1 = require("../helpers");
async function usersGet(req, res) {
    try {
        const users = (await models_1.User.findAndCount({
            where: { state: true },
            order: { updatedAt: "DESC", createdAt: "DESC" },
        })) || [];
        return res.status(200).json({
            total: users[1],
            users: users[0],
        });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
}
exports.usersGet = usersGet;
async function userGetById(req, res) {
    try {
        const { id } = req.params;
        const user = (await models_1.User.findOneBy({ uId: id, state: true })) || {};
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.userGetById = userGetById;
async function userPost(req, res) {
    try {
        const { firstName, lastName, email, password, isAdmin } = req.body;
        const user = new models_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.isAdmin = isAdmin;
        //Encriptar la contraseña
        user.password = bcryptjs_1.default.hashSync(password, 15);
        await user.save();
        const token = await (0, helpers_1.generateJWT)(user.uId, user.isAdmin);
        return res.status(201).json({
            user,
            token,
        });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.userPost = userPost;
async function userPut(req, res) {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, isAdmin } = req.body;
        let { password } = req.body;
        const user = await models_1.User.findOneBy({ uId: id });
        if (password)
            password = bcryptjs_1.default.hashSync(password, 15);
        if (user) {
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName;
            user.email = email ? email : user.email;
            user.password = password ? password : user.password;
            user.isAdmin = isAdmin ? isAdmin : user.isAdmin;
            await user.save();
        }
        return res.status(200).json({ msg: "User Updated", user });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.userPut = userPut;
async function userDelete(req, res) {
    try {
        const { id } = req.params;
        const payload = req.body;
        // set state = false but not delete user from db
        await models_1.User.update({ uId: id }, payload);
        return res.status(204).json();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
}
exports.userDelete = userDelete;
