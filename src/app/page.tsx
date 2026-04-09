"use client";

import { useState, useCallback } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import BrandIntro from "@/components/BrandIntro";
import VideoSection from "@/components/VideoSection";
import FeaturedProduct from "@/components/FeaturedProduct";
import Comparison from "@/components/Comparison";
import BundleBuilder from "@/components/BundleBuilder";
import Marquee from "@/components/Marquee";
import SocialFeed from "@/components/SocialFeed";
import CountdownTimer from "@/components/CountdownTimer";
import ProductGrid from "@/components/ProductGrid";
import Testimonial from "@/components/Testimonial";
import TabbedCategories from "@/components/TabbedCategories";
import BlogGrid from "@/components/BlogGrid";
import ValueProps from "@/components/ValueProps";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  const addMultipleToCart = useCallback((count: number) => {
    setCartCount((prev) => prev + count);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={cartCount} />
      <HeroSlider />
      <BrandIntro />
      <VideoSection />
      <FeaturedProduct onAddToCart={addToCart} />
      <Comparison />
      <BundleBuilder onAddToCart={addMultipleToCart} />
      <Marquee />
      <SocialFeed />
      <CountdownTimer onAddToCart={addToCart} />
      <ProductGrid onAddToCart={addToCart} />
      <Testimonial />
      <TabbedCategories />
      <BlogGrid />
      <ValueProps />
      <Footer />
      <NewsletterPopup />
      <BackToTop />
    </>
  );
}
