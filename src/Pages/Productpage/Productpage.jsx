import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import "./Productpage.css";

const ProductPage = () => {
  const { id } = useParams();
  const { products, addtocart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState("");
  const [loadingCart, setLoadingCart] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!products || products.length === 0) return <Spinner />;

  const product = products.find((p) => p._id === id);
  if (!product) return <p className="no-product">Product not found.</p>;

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
  setLoadingCart(true);
  const success = await addtocart({
    productId: product._id,
    quantity: 1,
  });
  setLoadingCart(false);

  if (!success) {
    navigate("/login"); // ✅ CORRECT PLACE
    return;
  }

  navigate("/cart");
};


  const handleBuyNow = async () => {
  setLoadingCart(true);
  const success = await addtocart({
    productId: product._id,
    quantity: 1,
  });
  setLoadingCart(false);

  if (!success) {
    navigate("/login");
    return;
  }

  navigate("/cart");
};

useEffect(()=>{
  window.scrollTo(0,0)
},[])


  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Collection
      </button>

      <div className="product-details">
        <div className="images-section">
          <div className="main-image">
            <img src={mainImage || "https://via.placeholder.com/400"} alt={product.shoeName} />
          </div>
          <div className="thumbnail-images">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.shoeName} ${idx + 1}`}
                onClick={() => setMainImage(img)}
                className={mainImage === img ? "active-thumb" : ""}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product.shoeName}</h2>

          <div className="price">
            {product.discountPrice ? (
              <>
                <span className="old-price">KES {product.price}</span>
                <span className="new-price">KES {product.discountPrice}</span>
              </>
            ) : (
              <span className="new-price">KES {product.price}</span>
            )}
          </div>

          <p className="description">{product.desc || "No description available."}</p>

          {/* Additional Product Details */}
          <div className="additional-info">
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Available Sizes:</strong> {product.shoeNumbers.join(", ")}</p>
            <p><strong>Colors:</strong> {product.color.join(", ")}</p>
            <p><strong>Availability:</strong> {product.isAvailable ? "In Stock" : "Out of Stock"}</p>
          </div>

          <div className="actions">
            <button onClick={handleAddToCart} disabled={loadingCart}>
              {loadingCart ? "Adding..." : "Add to Cart"}
            </button>
            <button onClick={handleBuyNow} disabled={loadingCart}>
              {loadingCart ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
