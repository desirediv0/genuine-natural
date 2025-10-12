"use client";

import { useState, useEffect } from "react";

import { fetchApi } from "@/lib/utils";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle, Award, Users } from "lucide-react";

import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";

import FeaturedProducts from "@/components/FeaturedProducts";
// Import the new individual parts so we can place them separately
import FeatureBanner, { ShowcaseHero, FeatureCards, ProductShowcase } from "@/components/featurebanner";
import Heading from "@/components/Heading";
import HeroCarousel from "@/components/HeroCarosal";

// Testimonials Section

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      location: "Mumbai, India",
      avatar: "/avatar1.jpg",
      quote:
        "I've tried many supplements, but these products have truly made a difference in my training and recovery. The results speak for themselves!",
      rating: 5,
      achievement: "Lost 15kg in 6 months",
      verified: true,
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      location: "Delhi, India",
      avatar: "/avatar2.jpg",
      quote:
        "The quality of these supplements is exceptional. I recommend them to all my clients looking for clean, natural nutrition.",
      rating: 5,
      achievement: "Certified Trainer",
      verified: true,
    },
    {
      name: "Arjun Singh",
      role: "Professional Bodybuilder",
      location: "Bangalore, India",
      avatar: "/avatar3.jpg",
      quote:
        "These supplements have been a game-changer for my competition prep. Pure ingredients, amazing results, and no side effects!",
      rating: 5,
      achievement: "Mr. India 2023",
      verified: true,
    },
    {
      name: "Sneha Kapoor",
      role: "Health Blogger",
      location: "Chennai, India",
      avatar: "/avatar4.jpg",
      quote:
        "As a health blogger, I appreciate the transparency and quality of these supplements. They align perfectly with my values.",
      rating: 5,
      achievement: "Top Health Blogger 2023",
      verified: true,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="py-10 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-black/3 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/3 rounded-full blur-3xl"
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-black/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-2 md:px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded px-6 py-3 mb-4"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.1)" }}
          >
            <Users className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Success Stories
            </span>
            <Users className="w-4 h-4 text-black" />
          </motion.div>


          <Heading
            title={"Real People Real Results"}
            description={<>
              Discover how our premium supplements have transformed the lives of
              thousands
              <br /> Join the success stories today.
            </>}
          />

        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto px-2 md:px-4"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white border-2 border-black rounded p-3 md:p-6 transition-all duration-300 hover:shadow-[12px_12px_0_0_#000] hover:-translate-x-2 hover:-translate-y-2 h-full">
                {/* Quote Icon */}
                <motion.div
                  className="hidden absolute -top-4 -right-4 w-10 h-10 bg-black rounded md:flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  <Quote className="w-6 h-6 text-white" />
                </motion.div>


                {/* Avatar and Info */}
                <div className="flex items-center mb-2">
                  <div className="ml-4">
                    <h3 className="font-black text-black text-lg mb-1 group-hover:text-black transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs md:text-sm text-black/60 font-medium ">{testimonial.role}</p>
                    <p className="text-xs text-black/50 ">{testimonial.location}</p>
                  </div>
                </div>

                {/* Achievement Badge */}
                <motion.div
                  className=" hidden md:inline-flex items-center gap-2 bg-black/5 rounded-full px-3 py-1 mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-3 h-3 text-black/60" />
                  <span className="text-xs font-medium text-black/70">
                    {testimonial.achievement}
                  </span>
                </motion.div>

                {/* Rating */}
                <div className="flex mb-2 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: 180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    >
                      <Star
                        className={`w-4 h-4  ${i < testimonial.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-yellow-500/30"
                          }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.p
                  className="text-black/80 text-xs md:text-base leading-relaxed font-medium mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                >
                  {testimonial.quote}
                </motion.p>

                {/* Bottom Line */}
                <motion.div
                  className="w-full h-[2px] bg-gradient-to-r from-transparent via-black/30 to-transparent"
                  whileHover={{ scaleX: 1.2, height: 4 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

// Home page component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivalsProducts, setNewArrivalsProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all product types
    const fetchData = async () => {
      try {
        setProductsLoading(true);

        // Fetch all product types in parallel
        const [featuredRes, bestsellerRes, trendingRes, newArrivalsRes] =
          await Promise.all([
            fetchApi("/public/products/type/featured?limit=8"),
            fetchApi("/public/products/type/bestseller?limit=8"),
            fetchApi("/public/products/type/trending?limit=8"),
            fetchApi("/public/products/type/new?limit=8"),
          ]);

        setFeaturedProducts(featuredRes?.data?.products || []);
        setBestsellerProducts(bestsellerRes?.data?.products || []);
        setTrendingProducts(trendingRes?.data?.products || []);
        setNewArrivalsProducts(newArrivalsRes?.data?.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err?.message || "Failed to fetch data");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* <HeroCarousel /> */}
      {/* <Hero /> */}
      <HeroCarousel />
      {/* <AnnouncementBanner /> */}

      {/* Featured Categories Section */}
      <FeaturedCategoriesSection />


      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-5 bg-gray-50">
          <div className="container mx-auto px-2 md:px-4">
            <Heading
              title="Featured Products"
              description="Handpicked premium supplements to enhance your fitness journey"
            />

            <FeaturedProducts
              products={featuredProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}


      {/* Bestseller Products Section */}
      {bestsellerProducts.length > 0 && (
        <section className="py-5 bg-white">
          <div className="container mx-auto px-2 md:px-4">
            <Heading
              title="Bestsellers"
              description="Our most popular products loved by thousands of customers"
            />

            <FeaturedProducts
              products={bestsellerProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      {/* Trending Products Section */}
      {trendingProducts.length > 0 && (
        <section className="py-5 bg-gray-50">
          <div className="container mx-auto px-2 md:px-4">
            <Heading
              title="Trending Now"
              description="Products that are currently trending and gaining popularity"
            />

            <FeaturedProducts
              products={trendingProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      <FeatureBanner only="cards" />

      {/* New Arrivals Section */}
      {newArrivalsProducts.length > 0 && (
        <section className="py-5 bg-white">
          <div className="container mx-auto px-2 md:px-4">
            <Heading
              title="New Arrivals"
              description="Fresh additions to our collection - be the first to try them"
            />

            <FeaturedProducts
              products={newArrivalsProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      {/* <GymSupplementShowcase /> */}
      <FeatureBanner only="hero" />
      <BenefitsSec />
      <FeatureBanner only="showcase" />
      <TestimonialsSection />
    </div>
  );
}
