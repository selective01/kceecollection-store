// Contact.jsx — Customer contact / support form
// Submits to POST /api/messages
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "../assets/css/contact.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, body } = form;
    if (!name || !email || !subject || !body) {
      setError("Please fill in all fields.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to send message");
      setSent(true);
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with Kcee Collection. We're here to help."
        url="https://Kcee_Collection.com/contact"
      />

      {/* Hero */}
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We usually respond within 24 hours</p>
      </div>

      <div className="contact-container">
        {/* Info cards */}
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fas fa-envelope" />
            </div>
            <div>
              <p className="contact-info-label">Email</p>
              <a href="mailto:support@Kcee_Collection.com" className="contact-info-value">
                support@Kcee_Collection.com
              </a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fas fa-phone" />
            </div>
            <div>
              <p className="contact-info-label">Phone / WhatsApp</p>
              <a href="tel:+2349137145633" className="contact-info-value">
                +234 913 714 5633
              </a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fas fa-clock" />
            </div>
            <div>
              <p className="contact-info-label">Business Hours</p>
              <p className="contact-info-value">Mon – Sat · 9am – 6pm WAT</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <i className="fas fa-map-marker-alt" />
            </div>
            <div>
              <p className="contact-info-label">Location</p>
              <p className="contact-info-value">Lagos, Nigeria</p>
            </div>
          </div>

          {/* Social links */}
          <div className="contact-socials">
            <p className="contact-socials-label">Follow us</p>
            <div className="contact-social-row">
              <a href="#" className="contact-social-btn" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="contact-social-btn" aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="contact-social-btn" aria-label="WhatsApp">
                <i className="fab fa-whatsapp" />
              </a>
              <a href="#" className="contact-social-btn" aria-label="Facebook">
                <i className="fab fa-facebook" />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <div className="contact-success-icon">
                <i className="fas fa-check" />
              </div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <div className="contact-success-actions">
                <button
                  className="contact-send-again-btn"
                  onClick={() => setSent(false)}
                >
                  Send another message
                </button>
                <Link to="/" className="contact-home-btn">Back to Shop</Link>
              </div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h2 className="contact-form-title">Send us a message</h2>

              {error && (
                <div className="contact-error">
                  <i className="fas fa-exclamation-circle" /> {error}
                </div>
              )}

              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label">Your Name *</label>
                  <input
                    className="contact-input"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label">Email Address *</label>
                  <input
                    className="contact-input"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">Subject *</label>
                <input
                  className="contact-input"
                  type="text"
                  name="subject"
                  placeholder="e.g. Order issue, Product question..."
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label className="contact-label">Message *</label>
                <textarea
                  className="contact-input contact-textarea"
                  name="body"
                  placeholder="Tell us how we can help you..."
                  value={form.body}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={sending}
              >
                {sending ? (
                  <><span className="contact-spinner" /> Sending...</>
                ) : (
                  <><i className="fas fa-paper-plane" /> Send Message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
