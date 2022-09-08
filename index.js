const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/../.env'}); //specify path to .env file
const app = require("./app.js");

app.listen(8080, () => console.log(`port ${8080}`))