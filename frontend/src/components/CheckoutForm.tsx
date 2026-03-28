import { type SubmitEvent, useState } from "react";
import { CardElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

type CheckoutFormProps = {
  amountCents: number;
};

export function CheckoutForm({ amountCents }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "Payment failed");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } else {
      setMessage("Payment succeeded.");
    }

    setLoading(false);
  };

  const dollars = (amountCents / 100).toFixed(2);

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <p className="checkout-amount">
        Total: <strong>${dollars}</strong> USD
      </p>
      <div className="checkout-element-wrap">
          <PaymentElement
             options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
              },
            }}
          />
          {/* <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#B4B0AE",
                  "::placeholder": {
                    color: "#B4B0AE",
                  },
                },
              },
            }}
            className="bg-themeBlack border-[1px] border-themeGray outline-none rounded-lg p-3"
          /> */}
      </div>
      <button
        className="checkout-pay"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? "Processing…" : `Pay $${dollars}`}
      </button>
      {message && (
        <p className="checkout-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
