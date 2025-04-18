import React, { useState, useEffect } from "react";
import PaymentForm from "./PaymentForms.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51R6wQSQcPPmDfWJk5KDjPCcTRcmg8kiv55ZACiHCR9CX56h7gMPcJNOiRaCoNRQrjH0cbdpHpuh2b2wRSN00PIA500YP74CTjf");

const ProceedToPay = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");
    const API_BASE = process.env.REACT_APP_API_URL;

    const amount = 200; // Amount in cents ($50.00)
    const userId = "65b2a12d2a5b5f001f8e6c2a"; // Replace with actual user ID

    useEffect(() => {
        if (showPaymentForm && !clientSecret) {
            fetch(`${API_BASE}/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, userId }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    } else {
                        setError("Failed to load payment details. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching clientSecret:", error);
                    setError("An error occurred while processing payment.");
                });
        }
    }, [showPaymentForm, clientSecret]);

    return (
        <div>
            <h2>Checkout</h2>
            {!showPaymentForm ? (
                <button onClick={() => setShowPaymentForm(true)}>
                    Proceed to Payment
                </button>
            ) : (
                error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm amount={amount} userId={userId} />
                    </Elements>
                ) : (
                    <p>Loading payment details...</p>
                )
            )}
        </div>
    );
};

export default ProceedToPay;
