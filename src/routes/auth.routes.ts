import { Router } from "express";
import { check } from "express-validator";

import { LogIn, SignUp, ResetPassword, ForgotPassword, ChangePassword, } from "../controllers";
import { IsUser, EmailExist, UserIdExist, ValidateJWT, ValidateFields, } from "../middlewares";

const AuthRoutes = Router();

AuthRoutes.post(
	"/login",
	[
		check(["email", "password"]).trim(),
		check("email", "Correo Electrónico requerido").notEmpty(),
		check("email", "Por favor ingrese un correo electrónico válido").isEmail(),
		check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8, }),
		ValidateFields,
	],
	LogIn
);

AuthRoutes.post(
	"/signup",
	[
		check(["firstName", "lastName", "email", "password"]).trim(),
		check("firstName", "Nombre/s requerido").notEmpty(),
		check("lastName", "Apellido/s requerido").notEmpty(),
		check("email", "Correo Electrónico inválido").isEmail(),
		EmailExist,
		check("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8, }),
		check("confirmPassword", "Contraseña de confirmación requerida").notEmpty(),
		ValidateFields
	],
	SignUp
);

AuthRoutes.patch(
	"/change-password/:id",
	[
		ValidateJWT, IsUser, UserIdExist,
		check(["currentPassword", "newPassword","confirmPassword"], "Todos los campos son requeridos").notEmpty(),
		check("newPassword", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
		ValidateFields
	],
	ChangePassword
);

AuthRoutes.post(
	"/forgot-password",
	[
		check("email", "Correo Electrónico requerido").notEmpty(),
		check("email", "Correo Electrónico inválido").isEmail(),
		ValidateFields,
	],
	ForgotPassword
);

AuthRoutes.put(
	"/reset-password/:resetToken",
	[
		check(["newPassword", "confirmPassword"], "Todos los campos son requeridos").notEmpty(),
		check("newPassword", "La nueva contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
		ValidateFields,
	],
	ResetPassword
);

export { AuthRoutes };
