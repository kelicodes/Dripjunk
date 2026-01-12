import "./Navbar.css";
import { useState, useRef, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { BsMoon, BsSun } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "light" : "dark"
    );
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <NavLink to="/"  className="logo">
        <p>
          DRIP <span>STORE</span>
        </p>
      </NavLink>

      {/* Desktop Menu */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/collection">Collection</NavLink>
        </li>
        <li>
          <NavLink to="/orders">Orders</NavLink>
        </li>
        <li className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <BsSun /> : <BsMoon />}
        </li>
      </ul>

      {/* Hamburger */}
      <div className="menu-icon" onClick={() => setOpen(true)}>
        <GiHamburgerMenu />
      </div>

      {/* Mobile Menu */}
      <div ref={menuRef} className={`mobile-menu ${open ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/collection" onClick={() => setOpen(false)}>
              Collection
            </NavLink>
          </li>
          <li>
            <NavLink to="/orders" onClick={() => setOpen(false)}>
              Orders
            </NavLink>
          </li>
          <li className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <BsSun /> : <BsMoon />}
          </li>
        </ul>
        <div className="mobile-close" onClick={() => setOpen(false)}>
          <GrClose />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
