"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDelete = exports.userPatch = exports.userPost = exports.userGetById = exports.usersGet = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const usersGet = async (req, res) => {
    try {
        const users = (await models_1.User.findAndCount({
            where: { state: true },
            order: { updatedAt: "DESC", createdAt: "DESC" }
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
};
exports.usersGet = usersGet;
const userGetById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = (await models_1.User.findOneBy({ uId: id, state: true })) || {};
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
};
exports.userGetById = userGetById;
const userPost = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new models_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        //Encriptar la contraseña
        const salt = bcryptjs_1.default.genSaltSync();
        user.password = bcryptjs_1.default.hashSync(password, salt);
        await user.save();
        return res.status(201).json({ user });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
};
exports.userPost = userPost;
const userPatch = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const exist = await models_1.User.findOneBy({ uId: id, state: true });
        //Check user is in db
        /*if (!exist) {
            return res.status(406).json({
                message: "ACTION NOT ALLOWED!!!",
            });
        }*/
        if (payload.password) {
            const salt = bcryptjs_1.default.genSaltSync();
            payload.password = bcryptjs_1.default.hashSync(payload.password, salt);
        }
        await models_1.User.update({ uId: id }, payload);
        return res.status(201).json();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
};
exports.userPatch = userPatch;
const userDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const exist = await models_1.User.findOneBy({ uId: id, state: true });
        //Check user is in db
        /*if (!exist) {
            return res.status(406).json({
                message: "ACTION NOT ALLOWED",
            });
        }*/
        // set state = false but not delete user from db
        await models_1.User.update({ uId: id }, payload);
        // delete user from db
        //await User.delete({ uId: id });
        return res.status(204).json();
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json(error);
    }
};
exports.userDelete = userDelete;
