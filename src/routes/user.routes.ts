import { Router } from "express";
import { check } from "express-validator";

import {
	usersGet,
	userGetById,
	userPost,
	userPatch,
	userDelete,
} from "../controllers";

import { userIdExist, emailExist } from "../helpers";
import { validateFields } from "../middlewares";

const userRoutes = Router();

userRoutes.get("/", [validateFields], usersGet);

userRoutes.get(
	"/:id",
	[
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields
	],
	userGetById
);

userRoutes.post(
	"/",
	[
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "firstName required").not().isEmpty(),
		check("lastName", "lastName required").not().isEmpty().trim(),
		check("email", "Invalid email").isEmail(),
		check("email").custom(emailExist),
		check("password", "Password must be betwen 8 and 20 letters").isLength({
			min: 8,
			max: 20,
		}),
		validateFields
	],
	userPost
);

userRoutes.patch(
	"/:id",
	[
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		check(["firstName", "lastName", "email", "password"]).trim(),
		validateFields,
	],
	userPatch
);

userRoutes.delete(
	"/:id",
	[
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields
	],
	userDelete
);

export { userRoutes };
