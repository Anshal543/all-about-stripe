import "dotenv/config";
import cors from "cors";
import express from "express";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const amount = req.body?.amount;
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 50) {
      res.status(400).json({
        error: "amount must be an integer of at least 50 (USD cents)",
      });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    const clientSecret = paymentIntent.client_secret;
    if (!clientSecret) {
      res.status(500).json({ error: "Missing client secret" });
      return;
    }

    res.json({ clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
