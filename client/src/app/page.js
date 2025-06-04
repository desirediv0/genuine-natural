"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight, Heart, Eye } from "lucide-react";

import { motion } from "framer-motion";

import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";
import Headtext from "@/components/ui/headtext";

import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/hero";
import FeatureBanner from "@/components/featurebanner";




// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      avatar: "/avatar1.jpg",
      quote:
        "I've tried many supplements, but these products have truly made a difference in my training and recovery.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      avatar: "/avatar2.jpg",
      quote:
        "The quality of these supplements is exceptional. I recommend them to all my clients looking for clean nutrition.",
      rating: 5,
    },
    {
      name: "Arjun Singh",
      role: "Bodybuilder",
      avatar: "/avatar3.jpg",
      quote:
        "These supplements have been a game-changer for my competition prep. Pure ingredients and great results!",
      rating: 5,
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#ce801f]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ce801f]/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Headtext text="WHAT OUR CUSTOMERS SAY" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
            Real experiences from people who trust our products
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>

                {/* Quote mark */}
                <div className="absolute top-6 right-6 text-6xl text-[#ce801f]/10 font-serif">
                  &quot;
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Avatar and info */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-[#ce801f]/20 shadow-md">
                      <div className="w-full h-full bg-gradient-to-br from-[#ce801f] to-[#ce801f]/80 flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-[#ce801f] font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-lg leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Bottom design element */}
                  <div className="mt-8 flex justify-center">
                    <motion.div
                      className="h-1 w-12 bg-[#ce801f]/30 rounded-full"
                      whileHover={{ width: 60 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
