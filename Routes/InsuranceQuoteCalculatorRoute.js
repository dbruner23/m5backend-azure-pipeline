const express = require('express');
const { calculateQuote } = require('../Controllers/InsuranceQuoteCalculatorController.js');
const InsuranceQuoteRouter = express.Router();

InsuranceQuoteRouter.get('/', calculateQuote);

module.exports = {
    InsuranceQuoteRouter,
};