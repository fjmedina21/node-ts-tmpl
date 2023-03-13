"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const SearchRoutes = (0, express_1.Router)();
exports.SearchRoutes = SearchRoutes;
SearchRoutes.get("/:term", controllers_1.Search);
