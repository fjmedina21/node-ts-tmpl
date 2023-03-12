"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const searchRoutes = (0, express_1.Router)();
exports.searchRoutes = searchRoutes;
searchRoutes.get("/:term", controllers_1.search);
