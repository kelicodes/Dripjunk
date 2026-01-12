import Navbar from "../../Components/Navbar/Navbar";
import Collections from "../Collections/Collection";
import Hero from "../../Components/Banner/Banner";
import Newarrivals from "../../Components/Newarrivals/Newarrivals";
import Slider from "../../Components/Slider/Slider";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";



const Home=()=>{
    const {products}=useContext(ShopContext)
    return <>
    <Hero/>
    <Slider/>
     <Collections/> 
    <Newarrivals/>  
    </>
}


export default Home