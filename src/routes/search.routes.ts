import { Router } from "express";

import { search } from "../controllers";

const searchRoutes = Router();

searchRoutes.get("/:term", search);

export { searchRoutes };
