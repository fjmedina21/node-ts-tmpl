"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$404Route = void 0;
const express_1 = require("express");
const $404Route = (0, express_1.Router)();
exports.$404Route = $404Route;
$404Route.all("*", (req, res) => {
    res.status(404).send("<h1>404! Page Not Found</h1>");
});
