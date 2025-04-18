import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import axios from 'axios';
import '../../index.css';

const PaymentForm = ({ amount, userId,courseId ,setEnrolled,setShowPaymentForm,setSuccessMessage}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const API_BASE = process.env.REACT_APP_API_URL;

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded yet.");
            setLoading(false);
            return;
        }
    
        // Ensure elements are submitted before confirming payment
        const submitResult = await elements.submit();
        if (submitResult.error) {
            alert(submitResult.error.message);
            setLoading(false);
            return;
        }
    
        // Confirm Payment with the same clientSecret
        const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required"
            // confirmParams: {
            //     return_url: "http://localhost:3000/success",
            // },
        });
    
        if (result.error) {
            alert(result.error.message);
        } else {
            // Send transaction details to backend
            const response = await axios.post(`${API_BASE}/update-payment-status`, {
                userId,
                amount,
                currency: "usd",
                transactionId: result.paymentIntent.id,
                status: result.paymentIntent.status,
            }, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status == 200) {
                // alert("Payment Successful!");
                // Now manually redirect to success page

                    setShowPaymentForm(false); 
                    try {
                        const enrolled = await fetch(`${API_BASE}/enroll`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ userID:userId, courseId, paymentId:response.data.payment._id })
                        });
                        if (enrolled.ok) {
                            setSuccessMessage('Enrollment successful!');
                            setEnrolled(true)
                        } else {
                            throw new Error('Enrollment failed.');
                        }
                    } catch (err) {
                        // setError('Something went wrong.');
                    }
                
            } else {
                console.error("Error saving transaction.");
            }
        }
        setLoading(false);
    };
    
    
    return (
        <form onSubmit={handlePayment}>
            <PaymentElement />
            <button type="submit" disabled={loading} className="paybtn btn mt-3" >
                {loading ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

export default PaymentForm;
