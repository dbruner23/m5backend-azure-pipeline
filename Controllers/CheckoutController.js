require("dotenv").config({path: __dirname + '/../../.env'}); //specify path to .env file);
const { policyItems, extraItems, planQuoteCalculator } = require("./InsuranceQuoteCalculatorController.js"); //Put all three inside {} because they're all coming from the same file location.
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY) // Set up stripe. Pass stripe key into the function.


// Post request to redirect us to the URL. Takes in a request and a response. Accessing server with post request.
// ***Currently, checkout session is created using data sent in req.body, which is fine for non-sensitive data, but in this caes, the quote price must not be tampered with.
// HTTP is raw data and will show quote price without encryption. HTTPS is encrypted.
const createCheckoutSession = async (req, res) => {
    try {
        var extraIndex = 1; // Set starting index at 1, since this is the first entry in extra items.
        const session = await stripe.checkout.sessions.create({
            // submit_type: 'pay',
            payment_method_types: ['card'], //Most use cases are card payment only. Everything with underscores in Stripe.

            line_items: [{ //return object in correct format for Stripe:
                    price_data: {
                        currency: 'nzd',
                        product_data: {
                            name: policyItems.get(req.body.plan).name,
                            description: policyItems.get(req.body.plan).description + `based on an excess of $${req.body.excess} and an agreed valuation of $${req.body.value}.`
                        },
                        unit_amount: planQuoteCalculator(req)*100 //price in cents ****Changed this - write a function which gets passed plan number, excess, value and it gives you plan value.
                    },
                    quantity: 1,
                }].concat( // Need to concatenate these two arrays (1. plan, 2. extras) into one array so that it's in the format of Stripe line_items (single array).
// *******  ATTENTION!! Only works if extras are selected in order i.e. only the following 4 scenarios work: i) choose no extras, ii) extra 1, iii) extras 1 and 2, or iv) extras 1, 2 & 3.
// TO FIX: Change extras from boolean to indexes instead [1,2,3] i.e. same as plans (mech breakdown has index of 1, ... etc.)...make them an array of items instead.            
                req.body.extras.map(extra => { //looping around the extras.
                if (extra) { //if extra ==true i.e. customer chose 1 of the 3 extras.
                    const extraItem = extraItems.get(extraIndex); //storeItem is the planItem that's been pull out of the above array. 'item' is the entry in the array passed in from req at front end.
                    
                    //if (item.excess != null && item.value != null) {
                    //    policyDescription += `based on an excess of $${item.excess} and an agreed valuation of $${item.value}.`
                    //    policyPrice = req.body.quote // **** Instead of getting this from the request body (passing the value over Http is not good), change this to call the insurance quote calculator instead and then front end just sends ID instead.
                    //}
                    return { //return object in correct format for Stripe:
                        price_data: {
                            currency: 'nzd',
                            product_data: {
                                name: extraItem.name,
                                description: extraItem.description
                            },
                            unit_amount: extraItem.priceInCents*100 //price in cents
                        },
                        quantity: 1,
                    };
                }
                extraIndex++; //looping around the extras array elements.

            })), //for each item in the map array, create a storeItem based on its id.
            
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
            name: req.body.d1firstname + " " + req.body.d1lastname, // will change to pull in from the request: req.body.customer.name
            email: req.body.email, // req.body.customer.email
            description: 'My first customer', //req.body.customer.description
          });
        
        //Create an invoice
        const invoice = await stripe.invoices.create({
            customer: customer.id,
            collection_method: 'send_invoice',
            days_until_due: 30,
          });

//Create a product, price and invoice item for the insurance plan choice:

        //Create a product
        const product = await stripe.products.create({
            name: policyItems.get(req.body.plan).name,
            description: policyItems.get(req.body.plan).description + `based on an excess of $${req.body.excess} and an agreed valuation of $${req.body.value}.`
        });

        //Create a price
        const price = await stripe.prices.create({
            product: product.id, // req.body.product.id
            unit_amount: planQuoteCalculator(req)*100, // Price of the plan
            currency: 'nzd',
        });
        
        //Create an invoice item
        const invoiceItem = await stripe.invoiceItems.create({
            customer: customer.id,
            price: price.id,
            invoice: invoice.id,
        });

//Create a product, price and invoice item for the extras choice(s):

        var extraIndex = 1; 
        for(const extra of req.body.extras) { // Similar to map - it loops over all elements in the array and gives you that element each time.
            if (extra) { //if extra ==true i.e. customer chose 1 of the 3 extras.
                const extraItem = extraItems.get(extraIndex);

                //Create a product
                const product = await stripe.products.create({name: extraItem.name, description: extraItem.description});
    
                //Create a price
                const price = await stripe.prices.create({
                    product: product.id, // Stripe creates id's for each object (i.e. product). Then we use this id to reference a particular customer, product etc.
                    unit_amount: extraItem.priceInCents*100, // 
                    currency: 'nzd',
                });
                
                //Create an invoice item
                const invoiceItem = await stripe.invoiceItems.create({
                    customer: customer.id,
                    price: price.id,
                    invoice: invoice.id,
                });
            }
            extraIndex ++;
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

