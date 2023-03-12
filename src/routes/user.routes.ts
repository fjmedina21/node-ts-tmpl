import { Router } from "express";
import { check } from "express-validator";

import { usersGet, userGetById, userPut, userDelete } from "../controllers";

import { userIdExist, emailExist } from "../helpers";
import { validateFields, validateJWT, isAdmin } from "../middlewares";

const userRoutes = Router();

userRoutes.get("/", [isAdmin, validateJWT], usersGet);

userRoutes.get(
	"/:id",
	[
		isAdmin,
		validateJWT,
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields,
	],
	userGetById
);

userRoutes.put(
	"/:id",
	[
		validateJWT,
		check(["id", "firstName", "lastName", "email", "password"]).trim(),
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		check("email", "Invalid email").isEmail(),
		check("email").custom(emailExist),
		validateFields,
	],
	userPut
);

userRoutes.delete(
	"/:id",
	[
		isAdmin,
		validateJWT,
		check("id", "Invalid ID").isUUID(),
		check("id").custom(userIdExist),
		validateFields,
	],
	userDelete
);

export { userRoutes };
