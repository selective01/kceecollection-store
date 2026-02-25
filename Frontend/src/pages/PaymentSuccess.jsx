import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("Invalid payment reference.");
        return;
      }

      try {
        const res = await axios.get(
          `${BASE_URL}/api/paystack/verify/${reference}`
        );

        if (res.data.success) {
          setStatus("Payment successful! Order confirmed.");
        } else {
          setStatus("Payment verification failed.");
        }
      } catch (error) {
        setStatus("Something went wrong.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="payment-success">
      <h2>{status}</h2>
    </div>
  );
}