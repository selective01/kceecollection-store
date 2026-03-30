import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateOrderId } from "../utils/orderUtils";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [orderId] = useState(generateOrderId);

  /* ── confetti ── */
  useEffect(() => {
    const canvas = document.getElementById("os-confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * 80 + 20,
      color: ["#3A9D23","#a8e6a3","#FFD700","#fff","#c8f5c0"][Math.floor(Math.random()*5)],
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      tilt: 0,
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.tiltAngle += p.tiltSpeed;
        p.y += Math.cos(p.d) + 2;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    const stop = setTimeout(() => cancelAnimationFrame(frame), 4000);
    return () => { cancelAnimationFrame(frame); clearTimeout(stop); };
  }, []);

  const steps = [
    { icon: "📦", label: "Order Received",   sub: "We're preparing your items"       },
    { icon: "🔍", label: "Quality Check",    sub: "Items inspected before dispatch"  },
    { icon: "🚚", label: "Out for Delivery", sub: "You'll be notified when it ships" },
    { icon: "🎉", label: "Delivered",        sub: "Enjoy your Kcee_Collection pieces"},
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .os-shell {
          min-height: calc(100vh - 64px);
          background: var(--background-color, #f5f5f5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Cabinet Grotesk', sans-serif;
        }

        #os-confetti {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* ── OUTER CARD ── */
        .os-card {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 860px;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.10);
          animation: os-rise .6s cubic-bezier(.22,1,.36,1) both;
          border: 1px solid #e0e0e0;
        }

        @keyframes os-rise {
          from { opacity: 0; transform: translateY(40px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── LEFT PANEL ── */
        .os-left {
          background: var(--white-color, #fff);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          border-right: 1px solid #e8e8e8;
        }

        .os-left-header h2 {
          font-family: 'Clash Display', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--black-color, #111);
          margin-bottom: 4px;
        }
        .os-left-header p {
          font-size: 13px;
          color: #999;
        }

        /* ── STEPS ── */
        .os-steps {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .os-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
          animation: os-slide .4s both;
        }
        .os-step:last-child { border-bottom: none; }
        .os-step:nth-child(1) { animation-delay: .5s; }
        .os-step:nth-child(2) { animation-delay: .65s; }
        .os-step:nth-child(3) { animation-delay: .8s; }
        .os-step:nth-child(4) { animation-delay: .95s; }

        @keyframes os-slide {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .os-step-dot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 4px;
        }
        .os-step-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e0e0e0;
          border: 2px solid #d0d0d0;
          flex-shrink: 0;
        }
        .os-step-dot.done {
          background: var(--design-color, #3A9D23);
          border-color: var(--design-color, #3A9D23);
          box-shadow: 0 0 8px rgba(58,157,35,.3);
        }
        .os-step-line {
          width: 1px;
          flex: 1;
          min-height: 24px;
          background: #ebebeb;
          margin-top: 4px;
        }

        .os-step-content strong {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--black-color, #111);
          margin-bottom: 2px;
        }
        .os-step-content span {
          font-size: 12px;
          color: #999;
        }

        /* ── CONTACT ROW ── */
        .os-contact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--background-color, #f5f5f5);
          border-radius: 10px;
          border: 1px solid #e8e8e8;
        }
        .os-contact-row p {
          font-size: 12px;
          color: #999;
        }
        .os-contact-link {
          font-size: 12px;
          font-weight: 700;
          color: var(--design-color, #3A9D23);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: .04em;
          text-transform: uppercase;
          transition: opacity .15s;
        }
        .os-contact-link:hover { opacity: .75; }

        /* ── RIGHT PANEL ── */
        .os-right {
          background: var(--white-color, #fff);
          padding: 52px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* Tick */
        .os-tick-wrap {
          width: 90px;
          height: 90px;
          margin-bottom: 28px;
          position: relative;
        }
        .os-tick-bg {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: var(--design-color, #3A9D23);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: os-pop .5s .2s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes os-pop {
          from { opacity: 0; transform: scale(0.3); }
          to   { opacity: 1; transform: scale(1); }
        }
        .os-tick-bg svg {
          width: 46px; height: 46px;
          stroke: #fff; stroke-width: 3;
          stroke-linecap: round; stroke-linejoin: round;
          fill: none;
        }
        .os-tick-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: os-draw .4s .7s ease forwards;
        }
        @keyframes os-draw { to { stroke-dashoffset: 0; } }

        .os-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid var(--design-color, #3A9D23);
          opacity: 0;
          animation: os-ring 1.3s .9s ease-out forwards;
        }
        @keyframes os-ring {
          0%   { transform: scale(1); opacity: .5; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .os-tag {
          display: inline-block;
          background: #edf7ea;
          color: #2e7d1e;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 100px;
          margin-bottom: 14px;
          border: 1px solid rgba(58,157,35,0.2);
        }

        .os-heading {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(1.3rem, 3vw, 1.7rem);
          font-weight: 700;
          color: var(--black-color, #111);
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .os-sub {
          font-size: 13.5px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 260px;
        }

        .os-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .os-btn-primary {
          width: 100%;
          background: var(--design-color, #3A9D23);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 24px;
          font-family: 'Clash Display', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: .03em;
          transition: opacity .18s, transform .12s;
        }
        .os-btn-primary:hover { opacity: .88; transform: translateY(-1px); }

        .os-btn-ghost {
          width: 100%;
          background: transparent;
          color: #444;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          padding: 13px 24px;
          font-family: 'Clash Display', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: .03em;
          transition: border-color .18s, transform .12s;
        }
        .os-btn-ghost:hover { border-color: #bbb; transform: translateY(-1px); }

        /* ── RESPONSIVE ── */
        @media (max-width: 680px) {
          .os-card { grid-template-columns: 1fr; }
          .os-left { padding: 32px 24px; border-right: none; border-bottom: 1px solid #e8e8e8; }
          .os-right { padding: 40px 24px; }
        }
      `}</style>

      <canvas id="os-confetti" style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />

      <div className="os-shell">
        <div className="os-card">

          {/* ── LEFT ── */}
          <div className="os-left">
            <div className="os-left-header">
              <h2>Summary</h2>
              <p>Order: {orderId}</p>
            </div>

            <div className="os-steps">
              {steps.map((s, i) => (
                <div className="os-step" key={i}>
                  <div className="os-step-dot-col">
                    <div className={`os-step-dot ${i === 0 ? "done" : ""}`} />
                    {i < steps.length - 1 && <div className="os-step-line" />}
                  </div>
                  <div className="os-step-content">
                    <strong>{s.label}</strong>
                    <span>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="os-contact-row">
              <p>Do you have problems about your order?</p>
              <a href="/contact" className="os-contact-link">
                Contact Us <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="os-right">
            <div className="os-tick-wrap">
              <div className="os-tick-bg">
                <svg viewBox="0 0 44 44">
                  <polyline className="os-tick-path" points="8,22 18,33 36,12" />
                </svg>
              </div>
              <div className="os-ring" />
            </div>

            <div className="os-tag">Order Confirmed</div>
            <h1 className="os-heading">Order has been placed!</h1>
            <p className="os-sub">
              Thanks for shopping with Kcee_Collection. We'll keep you updated every step of the way.
            </p>

            <div className="os-actions">
              <button className="os-btn-primary" onClick={() => navigate("/orders")}>
                Track My Order
              </button>
              <button className="os-btn-ghost" onClick={() => navigate("/")}>
                Return Home
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
