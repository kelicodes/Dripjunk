import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import "./ProductPage.css";

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
    const success = await addtocart({ productId: product._id, quantity: 1 },{ withCredentials: true });
    setLoadingCart(false);

    if (success) {
      navigate("/cart");
    }
  };

  const handleBuyNow = async () => {
    setLoadingCart(true);
    const success = await addtocart({ productId: product._id, quantity: 1 },{ withCredentials: true });
    setLoadingCart(false);

    if (success) {
      navigate("/cart");
    }
  };

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Collection
      </button>

      <div className="product-details">
        <div className="images-section">
          <div className="main-image">
            <img
              src={mainImage || "https://via.placeholder.com/400"}
              alt={product.name}
            />
          </div>
          <div className="thumbnail-images">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                onClick={() => setMainImage(img)}
                className={mainImage === img ? "active-thumb" : ""}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <div className="price">
            {product.discountPrice ? (
              <>
                <span className="old-price">KES {product.price}</span>
                <span className="new-price">
                  KES {product.price - product.discountPrice}
                </span>
              </>
            ) : (
              <span className="new-price">KES {product.price}</span>
            )}
          </div>
          <p className="description">
            {product.description || "No description available."}
          </p>

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
