import { Router, Request, Response } from "express";

const $404Route = Router();

$404Route.all("*", (req: Request, res: Response) => {
	res.status(404).send("<h1>404! Page Not Found</h1>");
});

export { $404Route };
