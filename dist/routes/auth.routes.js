"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const helpers_1 = require("../helpers");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
authRoutes.post("/login", [
    (0, express_validator_1.check)(["email", "password"]).trim(),
    (0, express_validator_1.check)("email", "Please enter a valid email.").isEmail(),
    (0, express_validator_1.check)("password", "Your password must be at least 8 characters.").isLength({ min: 8 }),
    middlewares_1.validateFields,
], controllers_1.login);
authRoutes.post("/signup", [
    (0, express_validator_1.check)(["firstName", "lastName", "email", "password"]).trim(),
    (0, express_validator_1.check)("firstName", "firstName required").not().isEmpty(),
    (0, express_validator_1.check)("lastName", "lastName required").not().isEmpty(),
    (0, express_validator_1.check)("email", "Invalid email").isEmail(),
    (0, express_validator_1.check)("email").custom(helpers_1.emailExist),
    (0, express_validator_1.check)("password", "Password must be at least 8 characters").isLength({
        min: 8,
    }),
    middlewares_1.validateFields,
], controllers_1.userPost);
