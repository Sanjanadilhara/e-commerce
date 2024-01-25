import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ComData from '../components/common.tsx';
import Container from 'react-bootstrap/Container';

import CheckoutForm from "../components/checkoutform.tsx";
import "../Pay.css";
import Navigation from "../components/navigation.tsx";



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51OJLnxDB5ydFCTRnc09RNasmEpFDXBjrwNtzZfRpNqWp085IOkutCplfKAmWa5Z08CO75nOGwHY5tcMQ6eAxzjUd00yCW5Bhs3");

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [total, setotal]=useState(0);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(ComData.ADDR+"/create-payment-intent", {
      method: "POST",
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) =>{ 
        setClientSecret(data.clientSecret);
        setotal(data.total);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options:any = {
    clientSecret,
    appearance,
  };

  return (
    <>
    <Navigation></Navigation>
    <Container className="d-flex justify-content-center">

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm total={total} />
        </Elements>
      )}
    </Container>
    </>
  );
}