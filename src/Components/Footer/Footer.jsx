import "./Footer.css"
import { NavLink } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* Brand */}
        <div className="footer-brand">
          <h3>DRIP <span>STORE</span></h3>
          <p>
            Premium streetwear crafted for comfort, confidence,
            and everyday style.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Shop</h4>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/collection">Collection</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/faq">FAQs</NavLink>
          <NavLink to="/returns">Returns</NavLink>
        </div>

        {/* Socials */}
        <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaFacebookF /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} DRIP STORE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
