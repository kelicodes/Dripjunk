import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { getCart, cart, addtocart, removefromcart } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart on load
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        await getCart();
      } catch (error) {
        console.error(error);
        navigate("/logpage"); // redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleIncrease = async (id, quantity) => {
    await addtocart(id, quantity + 1);
    await getCart();
  };

  const handleDecrease = async (id, quantity) => {
    if (quantity > 1) {
      await addtocart(id, quantity - 1);
      await getCart();
    }
  };

  const handleRemove = async (id) => {
    await removefromcart(id);
    await getCart();
  };

  const totalPrice = cart?.items?.reduce(
    (acc, item) =>
      acc +
      (item.product.discountPrice
        ? item.product.price - item.product.discountPrice
        : item.product.price) *
        item.quantity,
    0
  );

  if (loading) return <Spinner />;

  if (!cart || !cart.items?.length)
    return <p className="empty-cart">Your cart is empty.</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.product._id}>
            <img src={item.product.images[0]} alt={item.product.name} />
            <div className="item-info">
              <p className="item-name">{item.product.name}</p>
              <p className="item-price">
                {item.product.discountPrice
                  ? `KES ${item.product.price - item.product.discountPrice}`
                  : `KES ${item.product.price}`}
              </p>
              <div className="quantity-control">
                <button onClick={() => handleDecrease(item.product._id, item.quantity)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrease(item.product._id, item.quantity)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item.product._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
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
