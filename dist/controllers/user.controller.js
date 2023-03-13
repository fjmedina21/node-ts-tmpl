"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.PatchUser = exports.GetUser = exports.GetUsers = void 0;
const models_1 = require("../models");
async function GetUsers(req, res) {
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
        return res.status(400).json({ error });
    }
}
exports.GetUsers = GetUsers;
async function GetUser(req, res) {
    try {
        const { id } = req.params;
        const user = (await models_1.User.findOneBy({ uId: id, state: true })) || {};
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.GetUser = GetUser;
async function PatchUser(req, res) {
    try {
        //TODO: implementar validacion para el email
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;
        const user = await models_1.User.findOneBy({ uId: id });
        if (user) {
            user.firstName = firstName ? firstName : user.firstName;
            user.lastName = lastName ? lastName : user.lastName;
            user.email = email ? email : user.email;
            await user.save();
        }
        return res.status(200).json({ message: "User Updated", user });
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.PatchUser = PatchUser;
async function DeleteUser(req, res) {
    try {
        const { id } = req.params;
        const { state } = req.body;
        // set state = false but not delete user from db
        await models_1.User.update({ uId: id }, { state: state });
        return res.status(204).json();
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.DeleteUser = DeleteUser;
