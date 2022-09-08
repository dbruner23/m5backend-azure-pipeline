const calculateQuote = (req, res) => {
    // dummy data to test frontend
    // -----------------------------------------
    req.body = {
        make: "BMW", 
        model: "728i", 
        year: 2000, 
        enginecap: 2788, 
        business: true, 
        address: "", 
        startdate: "",
        d1firstname: "Logan", 
        d1lastname: "Lawson", 
        d1gender: "male", 
        d1birthday: "", 
        d1incidents: true, 
        d1licence: "class1", 
        d1policyhold: "", 
        email: "", 
        phone: "",
        plan: "", 
        excess: 100, 
        value: 5000,
        extras: [],
        quote: null
      }
    // -----------------------------------------
    const quote = req.body.value * 0.03 * req.body.enginecap / 1000 * 0.3 * (1 - req.body.excess / 2000);
    quote
    req.body.quote = quote;
    res.send(req.body);
};

module.exports = {
    calculateQuote
};