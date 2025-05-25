import React from "react"
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import WhyChooseUs from "../components/WhyChooseUs";
import CompleteProfilePrompt from "../components/CompleteProfilePrompt";






const Home = () => {
  return (
    <div>
      <ScrollToTop />
       <CompleteProfilePrompt />
      <Navbar />
       <Hero />
       <Stats/>
       <WhyChooseUs/>
       <HowItWorks />
       <Features/>
       <Testimonials/>
       <FinalCTA/>
       <Footer />
       
      {/* Other sections like Hero, Features will go here */}
    </div>
  )
}

export default Home
