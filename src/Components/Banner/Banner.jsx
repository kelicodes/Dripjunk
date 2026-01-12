import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../Context/ShopContext"
import { NavLink } from "react-router-dom"
import "./Banner.css"

const Hero = () => {
  const { products, fecthProducts } = useContext(ShopContext)
  const [active, setActive] = useState(0)

  useEffect(() => {
    fecthProducts()
  }, [])

  // Auto slide
  useEffect(() => {
    if (!products.length) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % products.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [products])

  const heroShoes = products.slice(0, 5)

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Step Into <span>Style</span>
        </h1>
        <p>Premium sneakers built for comfort, speed, and street dominance.</p>

        <NavLink to="/collection" className="hero-btn">
          Shop Collection
        </NavLink>
      </div>

      <div className="hero-slider">
        {heroShoes.map((shoe, index) => {
          const position =
            index === active
              ? "active"
              : index === (active - 1 + heroShoes.length) % heroShoes.length
              ? "prev"
              : index === (active + 1) % heroShoes.length
              ? "next"
              : "hidden"

          return (
            <div key={shoe._id} className={`slide ${position}`}>
              <img src={shoe.images?.[0]} alt={shoe.shoeName} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Hero
