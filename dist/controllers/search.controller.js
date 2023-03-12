"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models/");
async function search(req, res) {
    try {
        const { term } = req.params;
        const isUUID = false;
        if (isUUID) {
            const user = await models_1.User.findOneBy({
                uId: term,
                state: true,
            });
            return res.status(200).json({
                results: user ? [user] : [],
            });
        }
        else if (!isUUID) {
            const user = await models_1.User.findAndCount({
                where: [
                    { firstName: (0, typeorm_1.Like)(`%${term}%`) },
                    { lastName: (0, typeorm_1.Like)(`%${term}%`) }
                ],
            });
            return res.status(200).json({
                total: user[1],
                results: user[0],
            });
        }
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(400).json({ error });
    }
}
exports.search = search;
