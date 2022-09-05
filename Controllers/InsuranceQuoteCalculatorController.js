const calculateQuote = (req, res) => {

    const quote = req.body.planDetails.carValue * 0.03 * req.body.carDetails.CarInfo.EngineSize / 1000;
    req.body.insuranceQuoteValue = quote;
    res.send(req.body);
};

module.exports = {
    calculateQuote
};