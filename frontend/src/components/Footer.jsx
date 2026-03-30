// Footer.jsx — Upgraded design
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../assets/css/footer.css";

const Footer = () => {
  return (
    <footer className="kfooter">
      <div className="kfooter-top">
        {/* Brand column */}
        <div className="kfooter-col kfooter-brand-col">
          <p className="kfooter-brand">Kcee_Collection</p>
          <p className="kfooter-tagline">
            Bold urban fashion for modern men. We blend streetwear with luxury
            to create timeless, standout looks.
          </p>
          <div className="kfooter-socials">
            <a href="https://instagram.com/kcee_emmanuel01" target="_blank" rel="noopener noreferrer" className="kfooter-social" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
            <a href="https://wa.me/2349137145633" target="_blank" rel="noopener noreferrer" className="kfooter-social" aria-label="WhatsApp">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="mailto:kceecollection01@gmail.com" className="kfooter-social" aria-label="Email">
              <i className="fas fa-envelope" />
            </a>
          </div>
        </div>

        {/* Shop column */}
        <div className="kfooter-col">
          <h3 className="kfooter-heading">Shop</h3>
          <div className="kfooter-links">
            {[
              ["/hoodies",         "Hoodies"],
              ["/t-shirts",        "T-Shirts"],
              ["/sneakers",        "Sneakers"],
              ["/jeans",           "Jeans"],
              ["/designer-shirts", "Designer Shirts"],
              ["/watches",         "Watches"],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="kfooter-link">{label}</Link>
            ))}
          </div>
        </div>

        {/* Help column */}
        <div className="kfooter-col">
          <h3 className="kfooter-heading">Help</h3>
          <div className="kfooter-links">
            <Link to="/contact"   className="kfooter-link">Contact Us</Link>
            <Link to="/orders"    className="kfooter-link">Track Order</Link>
            <Link to="/dashboard" className="kfooter-link">My Account</Link>
            <Link to="/cart"      className="kfooter-link">Cart</Link>
          </div>
        </div>

        {/* Contact column */}
        <div className="kfooter-col">
          <h3 className="kfooter-heading">Contact</h3>
          <div className="kfooter-contact-list">
            <a href="tel:+2349137145633" className="kfooter-contact-item">
              <i className="fas fa-phone" />
              +234 913 714 5633
            </a>
            <a href="mailto:kceecollection01@gmail.com" className="kfooter-contact-item">
              <i className="fas fa-envelope" />
              kceecollection01@gmail.com
            </a>
            <a href="https://wa.me/2349137145633" target="_blank" rel="noopener noreferrer" className="kfooter-contact-item">
              <i className="fab fa-whatsapp" />
              Chat on WhatsApp
            </a>
            <p className="kfooter-contact-item">
              <i className="fas fa-truck" />
              Nationwide delivery · 1–3 working days
            </p>
          </div>
        </div>
      </div>

      <div className="kfooter-bottom">
        <p className="kfooter-signature">Designed for confidence. Worn with purpose.</p>
        <p className="kfooter-copy">&copy; {new Date().getFullYear()} Kcee_Collection. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
