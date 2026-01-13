// src/context/ShopContext.jsx
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./Authcontex";

export const ShopContext = createContext();

const BASE_URL = "https://dripg.onrender.com";

const api = axios.create({ baseURL: BASE_URL });

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const ShopContextProvider = ({ children }) => {
  const [cartdata, setCartdata] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { triggerAuthModal, setPendingAction } = useContext(AuthContext);

  // Fetch all products
  const fecthProducts = async () => {
    try {
      const res = await api.get("/product/fetchall");
      if (res.data.success) setProducts(res.data.products);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  // Get cart
  const getCart = async () => {
    try {
      const res = await api.get("/cart/mycart");
      const items = res.data.response.items.map((item) => ({
        ...item,
        product: null,
      }));
      setCartdata(items);
      return items;
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartdata([]);
      return [];
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to view orders");
      triggerAuthModal();
      return [];
    }

    try {
      const res = await api.get("/order/my-orders");
      if (res.data.success) {
        setOrders(res.data.orders);
        console.log(res)
        return res.data.orders;
      } else {
        toast.error("Failed to fetch orders");
        return [];
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong while fetching orders");
      return [];
    }
  };

  // Add to cart
  const addtocart = async ({ productId, quantity = 1 }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to continue");
      setPendingAction(() => () => addtocart({ productId, quantity }));
      triggerAuthModal();
      return false;
    }

    try {
      const res = await api.post("/cart/addtocart", { productId, quantity });
      if (res.data.success) {
        toast.success(res.data.message);
        await getCart();
        return true;
      }
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Session expired. Please login again");
        localStorage.removeItem("token");
        triggerAuthModal();
      } else {
        toast.error("Something went wrong");
        console.error(error);
      }
      return false;
    }
  };

  // Remove from cart
  const removefromcart = async (productId) => {
    try {
      const res = await api.post("/cart/remove", { productId });
      if (res.data.success) await getCart();
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  // Load cart on mount
  useEffect(() => {
    getCart();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        products,
        cartdata,
        orders,
        fecthProducts,
        fetchOrders, // <-- expose fetchOrders
        addtocart,
        removefromcart, 
        getCart,
        setCartdata,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
