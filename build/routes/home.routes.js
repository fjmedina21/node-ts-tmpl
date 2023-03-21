"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeRoute = void 0;
const express_1 = require("express");
const HomeRoute = (0, express_1.Router)();
exports.HomeRoute = HomeRoute;
HomeRoute.get("/", (req, res) => {
    res.status(200).send("<h1>Home</h1>");
});
