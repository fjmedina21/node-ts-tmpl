import { Router } from "express";
import { check } from "express-validator";

import { LogIn, SignUp } from "../controllers";
import { ValidateFields } from "../middlewares";
import { EmailExist } from "../helpers";

const AuthRoutes = Router();

AuthRoutes.post(
	"/login",
	[
		check(["email", "password"]).trim(),
		check("email", "Please enter a valid email.").isEmail(),
		check("password", "Your password must be at least 8 characters.").isLength({
			min: 8,
		}),
		ValidateFields,
	],
	LogIn
);

AuthRoutes.post(
	"/signup",
	[
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "firstName required").not().isEmpty(),
		check("lastName", "lastName required").not().isEmpty(),
		check("email", "Invalid email").isEmail().custom(EmailExist),
		check("password", "Password must be at least 8 characters").isLength({
			min: 8,
		}),
		ValidateFields,
	],
	SignUp
);

export { AuthRoutes };
