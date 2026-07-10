import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandPromise from "@/components/home/BrandPromise";
import BestSellers from "@/components/home/BestSellers";
import OfferCTA from "@/components/home/OfferCTA";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";
import PicklesSlideshow from "@/components/home/PicklesSlideshow";
export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        {/* <PicklesSlideshow /> */}
        <FeaturedProducts />
        <BrandPromise />
        <BestSellers />
        <OfferCTA />
        <Testimonials />
        <InstagramGallery />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
