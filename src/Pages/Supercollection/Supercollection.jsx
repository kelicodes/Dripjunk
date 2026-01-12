import { useEffect, useState, useContext } from "react";
import Card from "../../Components/Card/Card.jsx";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Slider/Slider.jsx";
import "./SuperCollection.css";

const SuperCollection = () => {
  const [theProducts, setTheProducts] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const { products } = useContext(ShopContext);

  // Sync products from context, filter out invalid ones
  useEffect(() => {
    if (products) {
      const validProducts = products.filter(p => p.name && p.price != null); // must have name and price
      setTheProducts(validProducts);
    }
  }, [products]);

  if (!theProducts.length) return <Spinner />;

  // Filter products safely
  const filteredProducts = theProducts.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

    const matchesPrice =
      priceFilter === ""
        ? true
        : priceFilter === "low"
        ? p.price <= 5000
        : priceFilter === "mid"
        ? p.price > 5000 && p.price <= 15000
        : p.price > 15000;

    return matchesSearch && matchesPrice;
  });

  return (
    <section className="supercollection">
      <div className="header">
        <h3>
          Our <span>Collection</span>
        </h3>
        <button
          className="toggle-filters"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          {filtersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {filtersOpen && (
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="low">Under 5,000</option>
            <option value="mid">5,001 – 15,000</option>
            <option value="high">Above 15,000</option>
          </select>
        </div>
      )}

      <div className="cards-container">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <Card
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              discountPrice={product.discountPrice}
              image={product.images?.[0] || "https://via.placeholder.com/200"}
            />
          ))
        ) : (
          <p className="no-results">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default SuperCollection;
