import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Home from "./Pages/Home/Home.jsx";
import SuperCollection from "./Pages/Supercollection/Supercollection.jsx";
import ProductPage from "./Pages/Productpage/Productpage.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import LoginPage from "./Pages/Log/Logpage.jsx";
import { AuthProvider } from "./Context/Authcontex.jsx";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const location = useLocation(); // get current route

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Don't show Navbar/Footer on /login
  const hideNavFooter = location.pathname === "/login";

  return (
    <AuthProvider>
      {!hideNavFooter && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<SuperCollection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>

      {!hideNavFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
