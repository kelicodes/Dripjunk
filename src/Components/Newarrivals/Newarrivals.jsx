import Card from "../Card/Card.jsx";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";
import "./Newarrivals.css"

const Newarrivals = () => {
  const { products } = useContext(ShopContext);

  if (!products || products.length === 0) return <p>Loading...</p>;

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="newarrivals">
      <h3>NEW ARRIVALS</h3>
      <div className="newarrivals-grid">
        {latestProducts.map((item) => (
          <Card
            key={item._id}
            id={item._id}
            name={item.shoeName}
            image={item.images?.[0] || "https://via.placeholder.com/150"}
            price={item.price}
            discountPrice={item.discountPrice}
          />
        ))}
      </div>
    </section>
  );
};

export default Newarrivals;
