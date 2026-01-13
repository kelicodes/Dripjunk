import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../../Components/Slider/Slider.jsx";
import "./Cartcheckout.css";

const BASE_URL = "https://dripg.onrender.com";

const Checkout = () => {
  const { cartdata, getCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    apartment: "",
    doorNumber: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Calculate total price
  const totalPrice = cartdata.reduce((acc, item) => {
    const price = item.product?.discountPrice ?? item.product?.price ?? 0;
    return acc + price * (item.quantity ?? 1);
  }, 0);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shipping.name || !shipping.phone || !shipping.apartment || !shipping.doorNumber) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/order/create`,
        {
          shippingAddress: `${shipping.name}, ${shipping.phone}, ${shipping.apartment}, Door: ${shipping.doorNumber}`,
          paymentMethod: "cash",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        alert("Order placed successfully!");
        getCart(); // refresh cart
        navigate("/orders");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartdata.length) return <p className="empty-cart">Your cart is empty.</p>;

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="checkout-items">
          <h3>Order Summary</h3>
          {cartdata.map((item) => {
            const product = item.product || {};
            const images =
              product.images && product.images.length > 0
                ? product.images
                : ["https://via.placeholder.com/150"];
            return (
              <div className="checkout-item" key={item._id}>
                <img src={images[0]} alt={product.shoeName || "Product"} />
                <div>
                  <p>{product.shoeName || "Unknown Product"}</p>
                  <p>Quantity: {item.quantity ?? 1}</p>
                  <p>Price: KES {product.discountPrice ?? product.price ?? 0}</p>
                </div>
              </div>
            );
          })}
          <h3>Total: KES {totalPrice}</h3>
        </div>

        <div className="checkout-form">
          <h3>Shipping Details</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shipping.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shipping.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apartment"
              placeholder="Apartment / Building Name"
              value={shipping.apartment}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="doorNumber"
              placeholder="Door / House Number"
              value={shipping.doorNumber}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Placing Order..." : "Pay on Delivery"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
