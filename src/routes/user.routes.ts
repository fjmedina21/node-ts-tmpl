import { Router } from "express";
import { check } from "express-validator";

import {
	GetUser,
	GetUsers,
	CreateUser,
	UpdateUser,
	DeleteUser,
} from "../controllers";

import {
	IsUser,
	IsAdmin,
	EmailExist,
	UserIdExist,
	ValidateJWT,
	ValidateFields,
} from "../middlewares";

const UserRoutes = Router();

UserRoutes.get("/", [ValidateJWT, IsAdmin, ValidateFields], GetUsers);

UserRoutes.get(
	"/:id",
	[ValidateJWT, IsAdmin, UserIdExist, ValidateFields],
	GetUser
);

UserRoutes.post(
	"/",
	[ValidateJWT, IsAdmin,
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "firstName required").notEmpty(),
		check("lastName", "lastName required").notEmpty(),
		check("email", "Invalid email").isEmail(),
		EmailExist,
		check("password", "Password must be at least 8 characters").isLength({ min: 8, }),
		ValidateFields],
	CreateUser
);

UserRoutes.patch(
	"/user/:id",
	[ValidateJWT, IsUser, UserIdExist,
		check(["firstName", "lastName", "email"]).trim(),
		//check("email","Invalid email").isEmail(),
		EmailExist,
		check("confirmPassword", "Password confirmatin required").notEmpty(),
		ValidateFields],
	UpdateUser
);

UserRoutes.delete(
	"/user/:id",
	[ValidateJWT, IsAdmin, UserIdExist, ValidateFields],
	DeleteUser
);

export { UserRoutes };
