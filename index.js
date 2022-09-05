const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/../.env'}); //specify path to .env file
const app = require("./app.js");

app.listen(process.env.SERVER_PORT, () => console.log(`port ${process.env.SERVER_PORT}`))