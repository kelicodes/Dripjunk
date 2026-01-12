import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { AuthContext } from "../../Context/Authcontex.jsx";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "./Card.css";

const Card = ({ id, name, image, price, discountPrice }) => {
  const { addtocart } = useContext(ShopContext);
  const { user, triggerAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // If user is not logged in, show modal
    if (!user) return triggerAuthModal();

    try {
      const success = await addtocart(id);
      if (success) {
        toast.success("Item added to cart!");
        setTimeout(() => navigate("/cart"), 800);
      } else {
        toast.error("Add to cart failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();

    if (!user) return triggerAuthModal();

    try {
      const success = await addtocart(id);
      if (success) navigate("/cart");
      else toast.error("Buy now failed");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Link to={`/product/${id}`} className="mycard">
      <div className="img">
        <img src={image} alt={name} />
      </div>

      <div className="info">
        <p>{name}</p>
        <div className="money">
          {discountPrice ? (
            <>
              <span className="old-price">KES {price}</span>
              <span className="new-price">KES {price - discountPrice}</span>
            </>
          ) : (
            <span className="new-price">KES {price}</span>
          )}
        </div>
      </div>

      <div className="button">
        <button onClick={handleBuyNow}>Buy Now</button>
        <button onClick={handleAddToCart}>Add To Cart</button>
      </div>
    </Link>
  );
};

export default Card;
