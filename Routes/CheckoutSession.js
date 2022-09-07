const express = require("express");
const { createCheckoutSession } = require("../Controllers/CheckoutController.js");
const { createInvoice } = require("../Controllers/CheckoutController.js");
const CheckoutRouter = express.Router();

CheckoutRouter.post("/pay", createCheckoutSession);
CheckoutRouter.post("/invoice", createInvoice);

module.exports = { //makes it externally available
    CheckoutRouter,
};
