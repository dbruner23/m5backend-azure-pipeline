const calculateQuote = (req, res) => {

    const quote = req.body.value * 0.03 * req.body.enginecap / 1000;
    req.body.quote = quote;
    res.send(req.body);
};

module.exports = {
    calculateQuote
};