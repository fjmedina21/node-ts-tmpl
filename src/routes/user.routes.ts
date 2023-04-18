import { Router } from "express";
import { check } from "express-validator";

import { GetUser, GetUsers, CreateUser, UpdateUser, DeleteUser, } from "../controllers";
import { IsUser, IsAdmin, EmailExist, UserIdExist, ValidateJWT, ValidateFields, } from "../middlewares";

const UserRoutes = Router();

UserRoutes.get("/", [ValidateJWT, IsUser, ValidateFields], GetUsers);

UserRoutes.get(
	"/:id",
	[ValidateJWT, IsUser, UserIdExist, ValidateFields],
	GetUser
);

UserRoutes.post(
	"/",
	[ValidateJWT, IsAdmin,
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "Nombre/s requerido").notEmpty(),
		check("lastName", "Apellido/s requerido").notEmpty(),
		check("email", "Correo Electrónico inválido").isEmail(),
		EmailExist,
		check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8, }),
		ValidateFields],
	CreateUser
);

UserRoutes.patch(
	"/:id",
	[ValidateJWT, IsUser, UserIdExist,
		check(["firstName", "lastName", "email"]).trim(),
		check("firstName", "Nombre/s requerido").notEmpty(),
		check("lastName", "Apellido/s requerido").notEmpty(),
		check("email", "Correo Electrónico requerido").notEmpty(),
		check("email","Correo Electrónico inválido").isEmail(),
		check("confirmPassword", "Contraseña de confirmación requerida").notEmpty(),
		ValidateFields],
	UpdateUser
);

UserRoutes.delete(
	"/:id",
	[ValidateJWT, IsUser, UserIdExist, ValidateFields],
	DeleteUser
);

export { UserRoutes };
