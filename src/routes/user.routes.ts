import { Router } from "express";
import { check } from "express-validator";

import {
	usersGet,
	userGetById,
	userPatch,
	userDelete,
} from "../controllers";

import { userIdExist, emailExist } from "../helpers";
import { validateFields, validateJWT } from "../middlewares";

const userRoutes = Router();

userRoutes.get("/", [validateJWT], usersGet);

userRoutes.get(
	"/:id",
	[
		validateJWT,
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields
	],
	userGetById
);

userRoutes.patch(
	"/:id",
	[
		validateJWT,
		check(["id", "firstName", "lastName", "email", "password"]).trim(),
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields,
	],
	userPatch
);

userRoutes.delete(
	"/:id",
	[
		validateJWT,
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields
	],
	userDelete
);

export { userRoutes };
