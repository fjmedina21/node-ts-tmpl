"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const helpers_1 = require("../helpers");
const middlewares_1 = require("../middlewares");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
userRoutes.get("/", [middlewares_1.isAdmin, middlewares_1.validateJWT], controllers_1.usersGet);
userRoutes.get("/:id", [
    middlewares_1.isAdmin,
    middlewares_1.validateJWT,
    (0, express_validator_1.check)("id", "Invalid ID").isUUID(),
    (0, express_validator_1.check)("id").custom(helpers_1.userIdExist),
    middlewares_1.validateFields,
], controllers_1.userGetById);
userRoutes.put("/:id", [
    middlewares_1.validateJWT,
    (0, express_validator_1.check)(["id", "firstName", "lastName", "email", "password"]).trim(),
    (0, express_validator_1.check)("id", "Invalid ID").isUUID(),
    (0, express_validator_1.check)("id").custom(helpers_1.userIdExist),
    (0, express_validator_1.check)("email", "Invalid email").isEmail(),
    (0, express_validator_1.check)("email").custom(helpers_1.emailExist),
    middlewares_1.validateFields,
], controllers_1.userPut);
userRoutes.delete("/:id", [
    middlewares_1.isAdmin,
    middlewares_1.validateJWT,
    (0, express_validator_1.check)("id", "Invalid ID").isUUID(),
    (0, express_validator_1.check)("id").custom(helpers_1.userIdExist),
    middlewares_1.validateFields,
], controllers_1.userDelete);
