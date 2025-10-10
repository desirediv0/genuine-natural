"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import Heading from "./Heading";

const CircularCategoryCard = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center group"
    >
      <motion.div
        className="relative w-full aspect-square rounded overflow-hidden group cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000),linear-gradient(45deg,#000000_25%,transparent_25%,transparent_75%,#000000_75%,#000000)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-5" />

        {/* Main Image Container with Overlay */}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <Image
            src={category.image || "/placeholder.jpg"}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          />

          {/* Category Content Overlay */}
          <div className="absolute inset-0 z-20 p-4 sm:p-6 flex flex-col justify-between ">
            <motion.div
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg self-end hidden md:flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              <span className="text-xs font-medium text-black">
                {category._count?.products || category.count || 0} Products
              </span>
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md tracking-wide truncate">
                {category.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 line-clamp-2 drop-shadow-md">
                {category.description || "Explore our collection"}
              </p>

              <motion.button
                className="md:mt-3  group/btn inline-flex items-center md:space-x-2 bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 rounded text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="hidden md:block">Shop Now</span>
                <svg
                  className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Border Gradient */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/20 to-black/0 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-[320px] h-[420px] rounded-[30px] bg-gray-200 relative overflow-hidden">
        <div className="h-[250px] bg-gray-300" />
        <div className="p-6">
          <div className="h-8 bg-gray-300 rounded-lg w-3/4 mb-3" />
          <div className="h-4 bg-gray-300 rounded w-full mb-2" />
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-6" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="h-12 bg-gray-300 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedCategoriesCarousel = ({ categories }) => {
  const [api, setApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No categories available at the moment</p>
      </div>
    );
  }

  return (
    <div className="relative px-4 p-2 md:p-4">
      <Carousel
        setApi={setApi}
        // align start so carousel doesn't center the slides on init; trimSnaps keeps snaps tidy
        opts={{ loop: true, align: "start", containScroll: "trimSnaps" }}
        className="w-full max-w-7xl mx-auto"
      >
        <CarouselContent className="-ml-4">
          {categories.map((category, index) => (
            <CarouselItem
              key={category.id || index}
              // Show 2 items per view on small screens, 3 on medium, 4 on large, 5 on xl+
              // add overflow-hidden and min-w-0 so flex-basis items don't overflow their container
              className="pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 overflow-hidden min-w-0"
            >
              <Link href={`/category/${category.slug || ""}`} className="block">
                <CircularCategoryCard category={category} index={index} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex absolute -left-12 -translate-x-0 bg-black/90 text-white backdrop-blur-sm border-none shadow-lg hover:bg-black hover:scale-110 transition-all duration-300" />
        <CarouselNext className="hidden md:flex absolute -right-12 -translate-x-0 bg-black/90 text-white backdrop-blur-sm border-none shadow-lg hover:bg-black hover:scale-110 transition-all duration-300" />

        {/* Dot indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {(() => {
            // Determine items per page according to the largest breakpoint we set on CarouselItem
            const itemsPerPage = 5; // matches xl:basis-1/5 => 5 items per view on xl and up
            const pageCount = Math.max(1, Math.ceil(categories.length / itemsPerPage));
            return Array.from({ length: pageCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx * itemsPerPage)}
                className={`w-8 h-1 rounded-full transition-all duration-300 ${Math.floor(currentIndex / itemsPerPage) === idx
                  ? "bg-black w-12"
                  : "bg-gray-400"
                  }`}
                aria-label={`Go to slide group ${idx + 1}`}
              />
            ));
          })()}
        </div>
      </Carousel>
    </div>
  );
};

const FeaturedCategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await fetchApi("/public/categories");
        setCategories(categoriesRes?.data?.categories || []);
        setCategoriesLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err?.message || "Failed to fetch categories");
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="md:mt-3 py-4 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 relative">
          <Heading
            title={"Featured Categories"}
            description={"Explore our collection of categories"}
          />

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-black/5 rounded-full blur-3xl -z-10" />
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {[...Array(3)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium">
              Failed to load categories
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Background Decorations */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-black/5 rounded-full blur-3xl" />

            <FeaturedCategoriesCarousel categories={categories} />
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/categories">
            <motion.button
              className="mt-3 group/btn inline-flex items-center space-x-2 bg-white/90 border border-black  backdrop-blur-sm text-black px-3 md:px-6 py-2 rounded-lg text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm md:text-base">View All Categories</span>
              <svg
                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
