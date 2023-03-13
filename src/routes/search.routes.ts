import { Router } from "express";

import { Search } from "../controllers";

const SearchRoutes = Router();

SearchRoutes.get("/:term", Search);

export { SearchRoutes };
