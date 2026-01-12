// src/Context/ShopContext.jsx
import axios from "axios";
import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./Authcontex"
 import { useNavigate } from "react-router-dom";


export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [cartdata, setCartdata] = useState([]);
  const [products, setProducts] = useState([]);

  const { triggerAuthModal,setPendingAction } = useContext(AuthContext);

  const BASE_URL = "https://dripg.onrender.com";

  // 🛍 Fetch all products
  const fecthProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product/fetchall`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

const addtocart = async ({ productId, quantity = 1 }) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/cart/addtocart`,
      { productId, quantity },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      getCart();
      return true;
    }

    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      // 🔥 User not logged in: redirect to login page
      toast.info("Please login to continue");
      return false;
    }

    toast.error("Something went wrong");
    console.error(error);
    return false;
  }
};
  // 🛒 Get cart
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/me`, {
        withCredentials: true,
      });

      if (!res.data.cart?.items) {
        setCartdata([]);
        return;
      }

      setCartdata(res.data.cart.items);
    } catch (error) {
      if (error.response?.status === 401) {
        setCartdata([]);
      } else {
        console.error("Get cart error:", error);
      }
    }
  };

  // ➖ Remove from cart
  const removefromcart = async (productId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/remove`,
        { productId },
        { withCredentials: true }
      );

      if (res.data.success) {
        getCart();
      }
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cartdata,
        fecthProducts,
        addtocart,
        removefromcart,
        getCart,
        BASE_URL,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
