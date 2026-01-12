import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar.jsx";
import "./App.css";
import Home from "./Pages/Home/Home.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import { Route, Routes } from "react-router-dom";
import SuperCollection from "./Pages/Supercollection/Supercollection.jsx";
import ProductPage from "./Pages/Productpage/Productpage.jsx";
import { AuthProvider, AuthContext } from "./Context/Authcontex.jsx"
import AuthModal from "./Pages/Log/Logpage.jsx";
import Cart from "./Pages/Cart/Cart.jsx";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  return (
    <AuthProvider>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<SuperCollection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      </div>
      <Footer />

      {/* Show modal if triggered */}
      <AuthContext.Consumer>
        {({ showAuthModal }) => showAuthModal && <AuthModal />}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
