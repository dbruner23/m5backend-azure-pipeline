const express = require("express");
const { createCheckoutSession } = require("../Controllers/CheckoutController.js");
const router = express.Router();

router.post("/", createCheckoutSession);

module.exports = {
    router,
};
