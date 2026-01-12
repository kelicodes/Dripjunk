import axios from "axios"
import { createContext, useState } from "react"
import { toast } from "react-toastify"

export const ShopContext = createContext()

export const ShopContextProvider = ({ children }) => {
  const [cartdata, setCartdata] = useState([])
  const [products, setProducts] = useState([])

  const BASE_URL = "https://dripg.onrender.com"

  const fecthProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product/fetchall`)
      if (res.data.success) {
        setProducts(res.data.products)
      }
    } catch (error) {
      console.log(error)
    }
  }

 const addtocart = async ({ productId, quantity = 1 }) => {
  try {
    const res = await axios.post(`${BASE_URL}/cart/addtocart`, {
      productId,
      quantity, // fixed typo from quantinty -> quantity
    });

    if (res.data.success) {
      toast.success(res.data.message);
      getCart(); // assuming this refreshes cart
      return true; // indicate success
    } else {
      toast.error(res.data.message || "Failed to add item to cart");
      return false;
    }
  } catch (error) {
    // Better logging
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Axios response error:", {
        status: error.response.status,
        data: error.response.data,
      });
      toast.error(error.response.data.message || "Server error");
    } else if (error.request) {
      // Request was made but no response received
      console.error("Axios request error:", error.request);
      toast.error("No response from server. Check your connection.");
    } else {
      // Something else happened
      console.error("Error in addtocart:", error.message);
      toast.error("Error adding to cart: " + error.message);
    }
    return false;
  }
};


  const getCart = async () => {
    const res = await axios.get(`${BASE_URL}/cart/me`)

    if (!res.data.cart?.items) {
      setCartdata([])
      return
    }

    const items = await Promise.all(
      res.data.cart.items.map(async (item) => {
        return item
      })
    )

    setCartdata(items)
  }

  const removefromcart = async (productId) => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/remove`, { productId })
      if (res.data.success) {
        getCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ShopContext.Provider
      value={{
        addtocart,
        removefromcart,
        getCart,
        BASE_URL,
        cartdata,
        fecthProducts,
        products,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}
