import { Router } from "express";
import { check } from "express-validator";

import {
	LogIn,
	SignUp,
	ResetPassword,
	ForgotPassword,
	ChangePassword,
} from "../controllers";

import {
	IsUser,
	EmailExist,
	UserIdExist,
	ValidateJWT,
	ValidateFields,
} from "../middlewares";

const AuthRoutes = Router();

AuthRoutes.post(
	"/login",
	[
		check(["email", "password"]).trim(),
		check("email", "Please enter a valid email.").isEmail(),
		check("password", "Your password must be at least 8 characters.").isLength({ min: 8, }),
		ValidateFields,
	],
	LogIn
);

AuthRoutes.post(
	"/signup",
	[
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "firstName required").notEmpty(),
		check("lastName", "lastName required").notEmpty(),
		check("email", "Invalid email").isEmail(),
		EmailExist,
		check("password", "Password must be at least 8 characters").isLength({ min: 8, }),
		check("confirmPassword", "Password confirmation required").notEmpty(),
		ValidateFields,
	],
	SignUp
);

AuthRoutes.put(
	"/change-password/:id",
	[
		ValidateJWT, IsUser, UserIdExist,
		check(["currentPassword", "newPassword"]).trim(),
		check(["currentPassword", "newPassword"], "All fields are required").notEmpty(),
		check("newPassword", "The new password must be 8 character minimum.").isLength({ min: 8 }),
		check("confirmPassword", "Password confirmation required").notEmpty(),
		ValidateFields,
	],
	ChangePassword
);

AuthRoutes.post(
	"/forgot-password",
	[
		check("email", "Email required").notEmpty(),
		check("email", "Invalid email").isEmail(),
		ValidateFields,
	],
	ForgotPassword
);

AuthRoutes.put(
	"/reset-password/:resetToken",
	[
		check(["newPassword", "confirmPassword"], "All fields are required").notEmpty(),
		check("newPassword", "The new password must be 8 character minimum.").isLength({ min: 8 }),
		ValidateFields,
	],
	ResetPassword
);

export { AuthRoutes };
