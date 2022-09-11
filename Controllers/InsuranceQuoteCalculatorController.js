// Store items for purchase. Use items map (key value pairs of items)
// **Keep item price and name on server in database or json, then just need to send ID from client to server (don't directly send price, otherwise someone can hack in and send a $0 price and get things for free).

// Const look-up tables:
const policyItems = new Map([
    [1, { priceInCents: 200, name: "Third Party, Fire & Theft", description: "Moderate cover - "}],
    [2, { priceInCents: 320, name: "Comprehensive Everyday Plan", description: "Full cover - "}],
    [3, { priceInCents: 150, name: "Third Party Only", description: "Basic cover - "}],
]);

const extraItems = new Map([
    [1, { priceInCents: 60, name: "Mechanical Breakdown Insurance", description: "Smart Extra - Mechanical Breakdown."}], //extras costs are fixed.
    [2, { priceInCents: 36, name: "Guaranteed Asset Protection", description: "Smart Extra - Guaranteed Asset Protection."}],
    [3, { priceInCents: 48, name: "Payment Protection Insurance", description: "Smart Extra - Payment Protection Insurance."}],
]);

//Adding quote price dependency on plan choice:
const planQuoteCalculator = (req) => {
    if(req.body.plan==1)
        k=0.8;
    else if(req.body.plan==2)
        k=1;
    else
        k=0.5;

    const planQuote = k*(req.body.value * 0.03 * req.body.enginecap / 1000 * 0.3 * (1 - req.body.excess / 2000));
    planQuote;

    return Math.round(planQuote*100)/100; //Round to 2 decimal places so that when x100 it's an integer.

    }


const calculateQuote = (req, res) => {
    // dummy data to test frontend
    // -----------------------------------------
    // req.body = {
    //     make: "BMW", 
    //     model: "728i", 
    //     year: 2000, 
    //     enginecap: 2788, 
    //     business: true, 
    //     address: "", 
    //     startdate: "",
    //     d1firstname: "Nichola", 
    //     d1lastname: "Selway", 
    //     d1gender: "female", 
    //     d1birthday: "", 
    //     d1incidents: true, 
    //     d1licence: "class1", 
    //     d1policyhold: "", 
    //     email: "nicholas@gmail.com", 
    //     phone: "",
    //     plan: "", 
    //     excess: 500, 
    //     value: 12000,
    //     extras: [true, false, false],
    //     quote: null
    //   }
    // -----------------------------------------
    

    //Adding extras price to total quote price:
    //Loop over extras array in the request body e.g. [true, false, false]:
    var extraPrice = 0;
    var extraIndex = 1; // Index of the extra from look up table.
    for (const extra of req.body.extras)
    {
        if (extra) // if true (i.e. the extra has been tickboxed by customer)
        {
            const extraItem = extraItems.get(extraIndex); // Use the index of the extra defined in request body to reference that equivalent item in the lookup table.
            extraPrice += extraItem.priceInCents; // extraPrice is the sum of costs for all extras tickboxed by customer.
        }
        extraIndex++;
    }

    const planQuote = planQuoteCalculator(req); //Calculates plan quote and sets variable planQuote to this value.
    const quote = planQuote + extraPrice;
    quote;

    req.body.quote = quote;
    res.send(req.body);
};

module.exports = {
    planQuoteCalculator,
    calculateQuote,
    policyItems,
    extraItems,
};