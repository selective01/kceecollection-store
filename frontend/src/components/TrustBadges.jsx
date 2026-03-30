// TrustBadges.jsx — New component
// Shows 4 trust signals: Free Shipping, Secure Payment, Returns, 24/7 Support
// Inspired by reference image design
import "../assets/css/trustbadges.css";

const badges = [
  {
    icon: "fa-truck",
    title: "Free Shipping",
    sub: "On all orders within Lagos",
    color: "#3A9D23",
  },
  {
    icon: "fa-shield-halved",
    title: "Secured Payment",
    sub: "Powered by Paystack",
    color: "#3A9D23",
  },
  {
    icon: "fa-rotate-left",
    title: "Easy Returns",
    sub: "Within 7 days of delivery",
    color: "#3A9D23",
  },
  {
    icon: "fa-headset",
    title: "24/7 Support",
    sub: "Chat on WhatsApp anytime",
    color: "#3A9D23",
  },
];

export default function TrustBadges() {
  return (
    <section className="trust-section">
      <div className="trust-grid">
        {badges.map((b, i) => (
          <div className="trust-card" key={i}>
            <div className="trust-icon-wrap">
              <i className={`fas ${b.icon} trust-icon`} style={{ color: b.color }} />
            </div>
            <div>
              <p className="trust-title">{b.title}</p>
              <p className="trust-sub">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
