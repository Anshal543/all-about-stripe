import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { CheckoutForm } from "./components/CheckoutForm";
import {
  stripeAppearanceDark,
  stripeAppearanceLight,
} from "./stripeAppearance";
import "./App.css";

const AMOUNT_CENTS = 1000;

function subscribeDark(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getDarkSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getDarkServerSnapshot() {
  return false;
}

export default function App() {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const prefersDark = useSyncExternalStore(
    subscribeDark,
    getDarkSnapshot,
    getDarkServerSnapshot,
  );
  const stripeAppearance = prefersDark
    ? stripeAppearanceDark
    : stripeAppearanceLight;

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // const [returnStatus, setReturnStatus] = useState<string | null>(null);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const secret = params.get("payment_intent_client_secret");
  //   if (!secret || !stripePromise) return;

  //   let cancelled = false;
  //   void (async () => {
  //     const stripe = await stripePromise;
  //     if (!stripe || cancelled) return;
  //     const { paymentIntent } = await stripe.retrievePaymentIntent(secret);
  //     if (cancelled) return;
  //     if (paymentIntent?.status === "succeeded") {
  //       setReturnStatus("Payment completed after authentication.");
  //     } else if (paymentIntent) {
  //       setReturnStatus(`Payment status: ${paymentIntent.status}`);
  //     }
  //     window.history.replaceState({}, "", window.location.pathname);
  //   })();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [stripePromise]);

  useEffect(() => {
    if (!publishableKey) return;

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: AMOUNT_CENTS }),
        });
        const data: { clientSecret?: string; error?: string } = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? res.statusText);
        }
        if (!data.clientSecret) {
          throw new Error("No client secret returned");
        }
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to start checkout");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publishableKey]);

  if (!publishableKey) {
    return (
      <main className="pay-page">
        <p className="pay-error" role="alert">
          Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in <code>frontend/.env</code>{" "}
          and restart Vite.
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="pay-page">
        <p className="pay-error" role="alert">
          {loadError}
        </p>
      </main>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <main className="pay-page">
        <p className="pay-loading">Preparing checkout…</p>
      </main>
    );
  }

  return (
    <main className="pay-page">
      <h1 className="pay-title">Test payment</h1>
      <p className="pay-sub">
        One-time payment (Payment Element). Use test card{" "}
        <code>4242 4242 4242 4242</code> with any future expiry and CVC.
      </p>
      {/* {returnStatus && (
        <p className="checkout-message" role="status">
          {returnStatus}
        </p>
      )} */}
      <Elements
        key={prefersDark ? "stripe-dark" : "stripe-light"}
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: stripeAppearance,
        }}
      >
        <CheckoutForm amountCents={AMOUNT_CENTS} />
      </Elements>
    </main>
  );
}
