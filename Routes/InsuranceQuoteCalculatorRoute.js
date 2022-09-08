const express = require('express');
const { calculateQuote } = require('../Controllers/InsuranceQuoteCalculatorController.js');
const InsuranceQuoteRouter = express.Router();

InsuranceQuoteRouter.post('/', calculateQuote);

module.exports = {
    InsuranceQuoteRouter,
};