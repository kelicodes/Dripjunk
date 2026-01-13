import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const BASE_URL = "https://dripg.onrender.com";

const Cart = () => {
  const { cartdata, getCart, addtocart, removefromcart } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch full product details
  useEffect(() => {
    const fetchCartWithProducts = async () => {
      setLoading(true);
      try {
        const cartItems = await getCart();

        if (!cartItems || !cartItems.length) {
          setCartProducts([]);
          setLoading(false);
          return;
        }

        const productsData = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const res = await axios.get(`${BASE_URL}/product/cartpro/${item.productId}`);
              return { ...item, product: res.data.product };
            } catch (err) {
              console.error("Error fetching product:", err);
              return { ...item, product: null };
            }
          })
        );

        setCartProducts(productsData);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCartWithProducts();
  }, []);

  const handleIncrease = async (productId, quantity) => {
    await addtocart({ productId, quantity: quantity + 1 });
    const updatedCart = await getCart();
    setCartProducts(updatedCart);
  };

  const handleDecrease = async (productId, quantity) => {
    if (quantity > 1) {
      await addtocart({ productId, quantity: quantity - 1 });
      const updatedCart = await getCart();
      setCartProducts(updatedCart);
    }
  };

  const handleRemove = async (productId) => {
    await removefromcart(productId);
    const updatedCart = await getCart();
    setCartProducts(updatedCart);
  };

  if (loading) return <Spinner />;

  if (!cartProducts.length) return <p className="empty-cart">Your cart is empty.</p>;

  const totalPrice = cartProducts.reduce((acc, item) => {
    const price = item.product?.discountPrice ?? item.product?.price ?? 0;
    return acc + price * (item.quantity ?? 1);
  }, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartProducts.map((item) => {
          const product = item.product || {};
          const images =
            product.images && product.images.length > 0
              ? product.images
              : ["https://dummyimage.com/150x150/cccccc/000000.png&text=No+Image"];
          return (
            <div className="cart-item" key={item._id}>
              <div className="cart-image">
                <img src={images[0]} alt={product.shoeName || "Product"} />
              </div>
              <div className="item-info">
                <p className="item-name">{product.shoeName || "Unknown Product"}</p>
                <p className="item-brand">Brand: {product.brand || "Unknown Brand"}</p>
                <p className="item-category">Category: {product.category || "Unknown"}</p>

                <div className="item-prices">
                  {product.discountPrice ? (
                    <>
                      <span className="old-price">KES {product.price || 0}</span>
                      <span className="discount-price">KES {product.discountPrice}</span>
                    </>
                  ) : (
                    <span className="price">KES {product.price || 0}</span>
                  )}
                </div>

                <div className="quantity-control">
                  <button onClick={() => handleDecrease(item.productId, item.quantity ?? 1)}>-</button>
                  <span>{item.quantity ?? 1}</span>
                  <button onClick={() => handleIncrease(item.productId, item.quantity ?? 1)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => handleRemove(item.productId)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Total: KES {totalPrice}</h3>
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
