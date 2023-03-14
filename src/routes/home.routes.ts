import { Router, Request, Response } from "express";
const HomeRoute = Router();

HomeRoute.get("/", (req: Request, res: Response) => {
	res.status(200).send("<h1>Home</h1>");
});

export { HomeRoute };
