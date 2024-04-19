require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html')
})

app.get('/cancel', (req, res) => {
    res.sendFile(__dirname + '/cancel.html')
})

app.post('/create-checkout-session', async (req, res) => {

    const body = req.body

    if (!body || !body.amount || body.amount < 1 || body.name.length < 1 || body.quantity < 1) {
        return res.status(400).send('Invalid request')
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: body.name,
                        images: ['https://fcity.in/images/products/319819104/emgui_258.jpg'],
                    },
                    unit_amount: body.amount,
                },
                quantity: body.quantity,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    })

    res.json({ url: session.url })
})

    
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})
