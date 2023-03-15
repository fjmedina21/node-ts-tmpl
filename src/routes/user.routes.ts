import { Router } from "express";
import { check } from "express-validator";

import { GetUser, GetUsers, PatchUser, DeleteUser } from "../controllers";

import {
	IsAdmin,
	EmailExist,
	UserIdExist,
	ValidateJWT,
	IsRegistered,
	ValidateFields,
} from "../middlewares";

const UserRoutes = Router();

UserRoutes.get("/", [ValidateJWT, ValidateFields], GetUsers);

UserRoutes.get(
	"/user/:id",
	[ValidateJWT, IsRegistered, UserIdExist, ValidateFields],
	GetUser
);

UserRoutes.patch(
	"/user/:id",
	[
		ValidateJWT,
		IsRegistered,
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
