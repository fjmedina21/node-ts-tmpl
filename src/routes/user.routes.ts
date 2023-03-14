import { Router } from "express";
import { check } from "express-validator";

import { GetUser, GetUsers, PatchUser, DeleteUser } from "../controllers";

import { UserIdExist } from "../helpers";
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
		//IsAdmin,
		ValidateJWT,
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		ValidateFields,
	],
	GetUser
);

UserRoutes.patch(
	"/:id",
	[
		IsUserAdmin,
		ValidateJWT,
		check(["id", "firstName", "lastName", "email", "password"]).trim(),
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		ValidateFields,
	],
	PatchUser
);

UserRoutes.delete(
	"/:id",
	[
		IsUserAdmin,
		ValidateJWT,
		check("id", "Invalid ID").isUUID().custom(UserIdExist),
		ValidateFields,
	],
	DeleteUser
);

export { UserRoutes };
