"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const helpers_1 = require("../helpers");
const middlewares_1 = require("../middlewares");
const UserRoutes = (0, express_1.Router)();
exports.UserRoutes = UserRoutes;
UserRoutes.get("/", [middlewares_1.IsAdmin, middlewares_1.ValidateFields], controllers_1.GetUsers);
UserRoutes.get("/:id", [
    middlewares_1.IsAdmin,
    middlewares_1.ValidateJWT,
    (0, express_validator_1.check)("id", "Invalid ID").isUUID().custom(helpers_1.UserIdExist),
    middlewares_1.ValidateFields,
], controllers_1.GetUser);
UserRoutes.patch("/:id", [
    middlewares_1.ValidateJWT,
    (0, express_validator_1.check)(["id", "firstName", "lastName", "email", "password"]).trim(),
    (0, express_validator_1.check)("id", "Invalid ID").isUUID().custom(helpers_1.UserIdExist),
    middlewares_1.ValidateFields,
], controllers_1.PatchUser);
UserRoutes.delete("/:id", [
    middlewares_1.IsAdmin,
    middlewares_1.ValidateJWT,
    (0, express_validator_1.check)("id", "Invalid ID").isUUID().custom(helpers_1.UserIdExist),
    middlewares_1.ValidateFields,
], controllers_1.DeleteUser);
