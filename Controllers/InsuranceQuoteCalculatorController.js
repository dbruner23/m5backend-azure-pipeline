
const calculateQuote = (req, res) => {

    const quote = req.body.planDetails.carValue * 0.1;
    req.body.insuranceQuoteValue = quote;
    res.send(req.body);
};

module.exports = {
    calculateQuote
};