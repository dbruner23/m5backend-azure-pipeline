require("dotenv").config({path: __dirname + '/../../.env'}); //specify path to .env file);
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY) // Set up stripe. Pass stripe key into the function.

// Store items for purchase. Use items map (key value pairs of items)
// **Keep item price and name on server in database or json, then just need to send ID from client to server (don't directly send price, otherwise someone can hack in and send a $0 price and get things for free).
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "TurnersInsurance" }],
    [2, { priceInCents: 20000, name: "TurnersInsuranceExtra"}],
])

// Post request to redirect us to the URL. Takes in a request and a response. Accessing server with post request.
const createCheckoutSession = async (req, res) => {
    console.log(stripe.STRIPE_PRIVATE_KEY);
    try {
        const session = await stripe.checkout.sessions.create({
            // submit_type: 'pay',
            payment_method_types: ['card'], //Most use cases are card payment only. Everything with underscores in Stripe.
            mode: 'payment', //one time payment. Could use 'subscription' as well, for example.
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return { //return object in correct format for Stripe:
                    price_data: {
                        currency: 'nzd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents //price in cents
                    },
                    quantity: item.quantity
                }
            }), // Array of items that we send down for purchase. Items object from script.js file.
            success_url: `${process.env.CLIENT_URL}/success.html`, //populate this in env variable, so we can change this in production and development.
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`
        }) //Get info from Stripe, function that takes in an object
        res.json({ url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message}) // Catch any errors send some json with our error.
    }
};

module.exports = {
    createCheckoutSession
};