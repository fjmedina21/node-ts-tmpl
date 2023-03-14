import { Router } from "express";
import { check } from "express-validator";

import { GetUser, GetUsers, PatchUser, DeleteUser } from "../controllers";

import { EmailExist, UserIdExist } from "../helpers";
import {
	IsAdmin,
	IsUserAdmin,
	ValidateJWT,
	ValidateFields,
} from "../middlewares";

const UserRoutes = Router();

UserRoutes.get("/", [ValidateJWT, ValidateFields], GetUsers);

UserRoutes.get(
	"/:id",
	[
		ValidateJWT,
		IsUserAdmin,
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		ValidateFields,
	],
	GetUser
);

UserRoutes.patch(
	"/:id",
	[
		ValidateJWT,
		IsUserAdmin,
		check(["id", "firstName", "lastName", "email", "password"]).trim(),
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		check("email", "Email already in use").custom(EmailExist),
		ValidateFields,
	],
	PatchUser
);

UserRoutes.delete(
	"/:id",
	[
		ValidateJWT,
		IsAdmin,
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		ValidateFields,
	],
	DeleteUser
);

export { UserRoutes };
