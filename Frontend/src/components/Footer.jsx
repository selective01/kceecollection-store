import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';



const Footer = () => {
  return (
    <footer className="footer-horizontal">
      <section className="foot1" id="about">
        <h3>About KceeCollection</h3>
        <p>
          KceeCollection is a bold urban fashion brand for modern men.
          We blend streetwear with luxury to create timeless, standout looks.
        </p>
      </section>

      <section className="foot2" id="contact">
        <h3>Contact Us</h3>
        <p>
          <i className="fas fa-phone footer-icon"></i>
          +234 913 714 5633
        </p>

        <p>
          <i className="fas fa-envelope footer-icon"></i>
          kceecollection01@gmail.com
        </p>

        <p>
          <i className="fab fa-instagram footer-icon"></i>
          <a 
            href="https://instagram.com/kcee_emmanuel01" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            @kcee_emmanuel01
          </a>
        </p>

        <p>
          <i className="fab fa-whatsapp footer-icon"></i>
          <a 
            href="https://wa.me/2349137145633" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </p>
      </section>

      <section className="foot3" id="delivery">
        <h3>Delivery</h3>
        <p>
          <i className="fas fa-truck footer-icon"></i>
          Nationwide delivery available
        </p>
        <p>
          Fast & secure shipping within 1–3 working days.
        </p>
      </section>

      <div className="footer-note">
        <p className="footer-signature">Designed for confidence. Worn with purpose.</p>
        <p>&copy; 2025 KceeCollection. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
