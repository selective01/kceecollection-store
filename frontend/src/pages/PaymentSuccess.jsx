// PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"

  useEffect(() => {
    const reference = searchParams.get("reference");

    // ✅ All setStatus calls are inside promise callbacks — never the effect body
    Promise.resolve(reference)
      .then((ref) => {
        if (!ref) throw new Error("no-reference");
        return axios.get(`${BASE_URL}/api/paystack/verify/${ref}`);
      })
      .then((res) => {
        if (res.data.success) {
          setStatus("success");
          setTimeout(() => navigate("/order-success"), 2000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "sans-serif" }}>
      {status === "verifying" && <p>Verifying your payment…</p>}
      {status === "success"   && <p style={{ color: "#3A9D23", fontSize: "1.2rem" }}>✅ Payment confirmed! Redirecting…</p>}
      {status === "failed"    && <p style={{ color: "red" }}>❌ Payment verification failed. Please contact support.</p>}
    </div>
  );
}