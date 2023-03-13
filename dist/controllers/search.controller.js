"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
const typeorm_1 = require("typeorm");
const models_1 = require("../models/");
async function Search(req, res) {
    try {
        const { term } = req.params;
        const isUUID = false; // TODO: validate if term is UUID
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
                    { state: true, firstName: (0, typeorm_1.Like)(`%${term}%`) },
                    { state: true, lastName: (0, typeorm_1.Like)(`%${term}%`) },
                ],
            });
            return res.status(200).json({
                total: user[1],
                results: user[0],
            });
        }
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
exports.Search = Search;
