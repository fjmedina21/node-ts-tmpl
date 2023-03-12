import { Router } from "express";
import { check } from "express-validator";

import { login, signup } from "../controllers";
import { validateFields } from "../middlewares";
import { emailExist, isEmail } from "../helpers";

const authRoutes = Router();

authRoutes.post(
	"/login",
	[
		check(["email", "password"]).trim(),
		check("email", "Please enter a valid email.").isEmail(),
		check("password", "Your password must be at least 8 characters.").isLength({
			min: 8,
		}),
		validateFields,
	],
	login
);

authRoutes.post(
	"/signup",
	[
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "firstName required").not().isEmpty(),
		check("lastName", "lastName required").not().isEmpty(),
		check("email", "Invalid email").custom(isEmail),
		check("email").custom(emailExist),
		check("password", "Password must be at least 8 characters").isLength({
			min: 8,
		}),
		validateFields,
	],
	signup
);

export { authRoutes };
