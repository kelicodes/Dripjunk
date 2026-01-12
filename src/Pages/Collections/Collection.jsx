import { useEffect, useState, useContext } from "react";
import Card from "../../Components/Card/Card.jsx";
import {ShopContext} from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import "./Collection.css"

const Collections = () => {
  const [theProducts, setTheProducts] = useState([]);
  const {products}= useContext(ShopContext);

  // Sync context products to local state
  useEffect(() => {
    if (products) {
      setTheProducts(products);
    }
  }, [products]);

  if (!theProducts.length) return <Spinner/>

  return (
    <div className="collection">
      <h3>
        Our <span>Collection.</span>
      </h3>

      <div className="cards-container">
        {theProducts.map((product) => (
          <Card
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            discountPrice={product.discountPrice}
            image={product.images?.[0]} // first image
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;
