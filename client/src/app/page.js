"use client";

import { useState, useEffect } from "react";

import { fetchApi } from "@/lib/utils";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle, Award, Users } from "lucide-react";

import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";

import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/hero";
import FeatureBanner from "@/components/featurebanner";

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
    <section className="py-24 bg-white relative overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded-full px-6 py-3 mb-8"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.1)" }}
          >
            <Users className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Success Stories
            </span>
            <Users className="w-4 h-4 text-black" />
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 20px rgba(0,0,0,0.1)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              REAL PEOPLE REAL RESULTS
            </motion.span>
         
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-1 bg-black rounded-full" />
            <div className="w-4 h-4 bg-black rounded-full" />
            <div className="w-16 h-1 bg-black rounded-full" />
          </motion.div>

          <motion.p
            className="text-black/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover how our premium supplements have transformed the lives of
            thousands
            <br />
            <span className="font-semibold text-black">
              Join the success stories today
            </span>
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white border-2 border-black rounded-3xl p-8 transition-all duration-300 hover:shadow-[12px_12px_0_0_#000] hover:-translate-x-2 hover:-translate-y-2 h-full">
                {/* Quote Icon */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-black rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  <Quote className="w-6 h-6 text-white" />
                </motion.div>

                {/* Verified Badge */}
                {testimonial.verified && (
                  <motion.div
                    className="absolute -top-2 -left-2 bg-black text-white p-2 rounded-full"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                )}

                {/* Avatar and Info */}
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-16 h-16 relative rounded-2xl overflow-hidden border-2 border-black shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.substring(0, 2).toUpperCase()}
                    </div>
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="font-black text-black text-lg mb-1 group-hover:text-black transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-black/60 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-black/50">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                {/* Achievement Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 bg-black/5 rounded-full px-3 py-1 mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-3 h-3 text-black/60" />
                  <span className="text-xs font-medium text-black/70">
                    {testimonial.achievement}
                  </span>
                </motion.div>

                {/* Rating */}
                <div className="flex mb-6 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: 180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-black fill-black"
                            : "text-black/30"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.p
                  className="text-black/80 text-base leading-relaxed font-medium mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                >
                  {testimonial.quote}
                </motion.p>

                {/* Bottom Design Element */}
                <motion.div
                  className="w-full h-[2px] bg-gradient-to-r from-transparent via-black/30 to-transparent"
                  whileHover={{ scaleX: 1.2, height: 4 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-black/5 rounded-3xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "4.9/5", label: "Average Rating" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-black text-black mb-2"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(0,0,0,0)",
                      "0 0 10px rgba(0,0,0,0.1)",
                      "0 0 0px rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-black/60 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Home page component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch featured products
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetchApi(
          "/public/products?featured=true&limit=8"
        );
        setFeaturedProducts(productsRes?.data?.products || []);
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
      <Hero />
      {/* <AnnouncementBanner /> */}

      {/* Featured Categories Section */}
      <FeaturedCategoriesSection />

      <FeatureBanner />

      {/* Featured Products Section */}
      {featuredProducts.length && (
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* <div className="text-center mb-12">
              <Headtext text="FEATURED PRODUCTS" />
              <p className="text-gray-600 my-6 max-w-2xl mx-auto">
                High-quality supplements to enhance your fitness journey
              </p>
            </div> */}

            <FeaturedProducts
              products={featuredProducts}
              isLoading={productsLoading}
              error={error}
            />
          </div>
        </section>
      )}

      {/* <GymSupplementShowcase /> */}
      <BenefitsSec />
      <TestimonialsSection />
    </div>
  );
}
