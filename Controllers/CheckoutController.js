require("dotenv").config({path: __dirname + '/../../.env'}); //specify path to .env file);
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY) // Set up stripe. Pass stripe key into the function.

// Store items for purchase. Use items map (key value pairs of items)
// **Keep item price and name on server in database or json, then just need to send ID from client to server (don't directly send price, otherwise someone can hack in and send a $0 price and get things for free).
const policyItems = new Map([
    [1, { priceInCents: 20000, name: "Third Party, Fire & Theft", description: "Moderate cover - "}],
    [2, { priceInCents: 32000, name: "Comprehensive Everyday Plan", description: "Full cover - "}],
    [3, { priceInCents: 15000, name: "Third Party Only", description: "Basic cover - "}],
    [4, { priceInCents: 6000, name: "Mechanical Breakdown Insurance", description: "Smart Extra - Mechanical Breakdown."}],
    [5, { priceInCents: 3600, name: "Guaranteed Asset Protection", description: "Smart Extra - Guaranteed Asset Protection."}],
    [6, { priceInCents: 4800, name: "Payment Protection Insurance", description: "Smart Extra - Payment Protection Insurance."}],
])

// Post request to redirect us to the URL. Takes in a request and a response. Accessing server with post request.
const createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            // submit_type: 'pay',
            payment_method_types: ['card'], //Most use cases are card payment only. Everything with underscores in Stripe.
            line_items: req.body.items.map(item => { 
                const policyItem = policyItems.get(item.id) //storeItem is the planItem that's been pull out of the above array. 'item' is the entry in the array passed in from req at front end.
                var policyDescription = policyItem.description
                if (item.excess != null && item.value != null) {
                    policyDescription += `based on an excess of $${item.excess} and an agreed valuation of $${item.value}.`
                }
                return { //return object in correct format for Stripe:
                    price_data: {
                        currency: 'nzd',
                        product_data: {
                            name: policyItem.name,
                            description: policyDescription
                        },
                        unit_amount: policyItem.priceInCents //price in cents
                    },
                    quantity: 1,
                };
            }), //for each item in the map array, create a storeItem based on its id.
            // Array of items that we send down for purchase. Items object from script.js file.
            mode: 'payment', //one time payment. Could use 'subscription' as well, for example.
            allow_promotion_codes: true, //Enable user-redeemable promotion codes using the 'allow_promotions_code' API parameter
            success_url: `${process.env.CLIENT_URL}/success`, //populate this in env variable, so we can change this in production and development.
            cancel_url: `${process.env.CLIENT_URL}/summary`
        }) //Get info from Stripe, function that takes in an object
        res.json({ url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message}) // Catch any errors send some json with our error.
    }
};

const createInvoice = async (req, res) => {

    try {
        //Create a customer
        const customer = await stripe.customers.create({
            name: req.body.customer.name, // will change to pull in from the request: req.body.customer.name
            email: req.body.customer.email, // req.body.customer.email
            description: 'My first customer', //req.body.customer.description
          });
        
        //Create an invoice
        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: 'send_invoice',
            days_until_due: 30,
          });

        //Create items loop (for each item sent through in the request body --> create a product, price and invoice item):
        for(const item of req.body.items) {
        // req.body.items.map(item => { 
            const policyItem = policyItems.get(item.id) //storeItem is the planItem that's been pull out of the above array. 'item' is the entry in the array passed in from req at front end.
            var policyDescription = policyItem.description
            if (item.excess != null && item.value != null) {
                policyDescription += `Plan based on an excess of $${item.excess} and an agreed valuation of $${item.value}.`
            }
            //Create a product
            const product = await stripe.products.create({name: policyItem.name, description: policyItem.description});

            //Create a price
            const price = await stripe.prices.create({
                product: product.id, // req.body.product.id
                unit_amount: policyItem.priceInCents, //req.body.product.price
                currency: 'nzd',
            });
            
            //Create an invoice item
            const invoiceItem = await stripe.invoiceItems.create({
                customer: customer.id,
                price: price.id,
                invoice: invoice.id,
            });
        }

    //Finalise invoice
    const finalInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    console.log(finalInvoice.invoice_pdf);


res.json({ url: finalInvoice.invoice_pdf})
    } catch (e) {
        res.status(500).json({error: e.message}) // Catch any errors send some json with our error.
    }
};


module.exports = {
    createCheckoutSession,
    createInvoice,
};

