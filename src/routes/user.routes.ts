import { Router } from "express";
import { check } from "express-validator";

import { GetUser, GetUsers, PatchUser, DeleteUser } from "../controllers";

import {
 IsUser,
 IsAdmin,
	EmailExist,
	UserIdExist,
	ValidateJWT,
	ValidateFields,
} from "../middlewares";

const UserRoutes = Router();

UserRoutes.get("/", [ValidateJWT, IsUser, ValidateFields], GetUsers);

UserRoutes.get(
	"/user/:id",
	[ValidateJWT, IsUser, UserIdExist, ValidateFields],
	GetUser
);

UserRoutes.patch(
	"/user/:id",
	[
		ValidateJWT,
		IsUser,
		check(["id", "firstName", "lastName", "email", "password"]).trim(),
		UserIdExist,
		check("email", "Invalid email").isEmail(),
		EmailExist,
		ValidateFields,
	],
	PatchUser
);

UserRoutes.delete(
	"/user/:id",
	[ValidateJWT, IsAdmin, UserIdExist, ValidateFields],
	DeleteUser
);

export { UserRoutes };
