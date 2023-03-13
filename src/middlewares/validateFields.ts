import { Request, Response, NextFunction } from "express";
import { Result, validationResult } from "express-validator";

export function ValidateFields(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors: Result = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}

	next();
}
