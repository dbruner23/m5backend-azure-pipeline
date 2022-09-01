const express = require("express");
const { getRego } = require("../Controllers/SearchController.js");
const router = express.Router();

router.get("/:rego", getRego);

module.exports = {
    router,
};
