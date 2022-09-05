const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router } = require("./Routes/CheckoutSession.js");
const { SearchRouter } = require("./Routes/SearchRoute.js");
const { InsuranceQuoteRouter } = require('./Routes/InsuranceQuoteCalculatorRoute.js');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/checkout", router);
app.use("/regosearch", SearchRouter);
app.use('/insurancequotecalculator', InsuranceQuoteRouter);

module.exports = app;
