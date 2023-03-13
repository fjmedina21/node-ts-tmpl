"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const helpers_1 = require("../helpers");
const AuthRoutes = (0, express_1.Router)();
exports.AuthRoutes = AuthRoutes;
AuthRoutes.post("/login", [
    (0, express_validator_1.check)(["email", "password"]).trim(),
    (0, express_validator_1.check)("email", "Please enter a valid email.").isEmail(),
    (0, express_validator_1.check)("password", "Your password must be at least 8 characters.").isLength({
        min: 8,
    }),
    middlewares_1.ValidateFields,
], controllers_1.LogIn);
AuthRoutes.post("/signup", [
    (0, express_validator_1.check)(["firstName", "lastName", "email", "password"]).trim(),
    (0, express_validator_1.check)("firstName", "firstName required").not().isEmpty(),
    (0, express_validator_1.check)("lastName", "lastName required").not().isEmpty(),
    (0, express_validator_1.check)("email", "Invalid email").isEmail().custom(helpers_1.EmailExist),
    (0, express_validator_1.check)("password", "Password must be at least 8 characters").isLength({
        min: 8,
    }),
    middlewares_1.ValidateFields,
], controllers_1.SignUp);
AuthRoutes.patch("/change-password/:id", [
    middlewares_1.ValidateJWT,
    (0, express_validator_1.check)(["id", "currentPassword", "newPassword", "confirmPassword"]).trim(),
    (0, express_validator_1.check)("id", "Invalid ID").isUUID().custom(helpers_1.UserIdExist),
    (0, express_validator_1.check)(["currentPassword", "newPassword", "confirmPassword"], "All fields are required")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("newPassword", "The new password must be 8 character minimum.").isLength({
        min: 8,
    }),
    middlewares_1.ValidateFields,
], controllers_1.ChangePassword);
