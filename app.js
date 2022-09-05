const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
//const router1 = require("./Routes/SearchRoute.js");
const { router } = require("./Routes/CheckoutSession.js");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use("/regosearch", router1);
app.use("/checkout", router);

module.exports = app;
