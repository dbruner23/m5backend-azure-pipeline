const express = require("express");
const { getRego } = require("../Controllers/SearchController.js");
const SearchRouter = express.Router();

SearchRouter.get("/:rego", getRego);

module.exports = {
    SearchRouter,
};
