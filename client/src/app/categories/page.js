"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, ShoppingBag } from "lucide-react";

// Category card component
const CategoryCard = ({ category, index }) => {
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg?height=300&width=400";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.1, 0.3) }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col items-center  group"
    >
      <div className="relative w-full aspect-square">
        <motion.div
          className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-lg bg-white/30 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Main Image Container with Overlay */}
          <div className="relative h-[65%] overflow-hidden  ">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10" />
            <Image
              src={getImageUrl(category.image)}
              alt={category.name}
              width={400}
              height={400}
              priority={index < 4}
              loading={index < 4 ? "eager" : "lazy"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              quality={90}
            />

            {/* Product Count Badge */}
            <motion.div
              className="absolute top-4 right-4 z-20"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-900">
                  {category._count?.products || 0} Products
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-6 relative h-[35%] flex flex-col bg-gradient-to-t from-white/80 to-white/40">
            <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1 tracking-tight">
              {category.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">
              {category.description || "Explore our collection"}
            </p>

            {/* Interactive Button */}
            <div className="mt-auto">
              <motion.button
                className="w-full bg-black/90 backdrop-blur-sm text-white py-3 rounded-xl flex items-center justify-center group relative overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative flex items-center space-x-2">
                  <span className="font-medium">Explore Collection</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
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
                </span>
              </motion.button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl opacity-60" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Category skeleton loader for loading state
const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full aspect-square rounded-2xl bg-white/30 backdrop-blur-lg border border-white/20 relative overflow-hidden">
        <div className="h-[65%] bg-gray-200/50" />
        <div className="p-6 bg-gradient-to-t from-white/80 to-white/40">
          <div className="h-7 bg-gray-200/50 rounded-xl w-3/4 mb-3" />
          <div className="h-4 bg-gray-100/50 rounded-xl w-full mb-2" />
          <div className="h-4 bg-gray-100/50 rounded-xl w-2/3 mb-4" />
          <div className="h-12 bg-gray-200/50 rounded-xl w-full mt-auto" />
        </div>
      </div>
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="min-h-screen  py-20  bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl mb-8 shadow-xl">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
              Explore Categories
            </h1>
            <div className="flex items-center justify-center text-sm text-gray-600 mb-6 font-medium">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="mx-2">•</span>
              <span className="text-black">Categories</span>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
              Discover our complete range of premium fitness supplements and
              equipment
            </p>
          </motion.div>

          {/* Enhanced Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50/80 backdrop-blur-sm border border-red-100 p-8 rounded-2xl mb-12 flex items-start max-w-2xl mx-auto shadow-lg"
          >
            <AlertCircle className="text-red-500 mr-4 mt-0.5 flex-shrink-0 h-6 w-6" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2 text-lg">
                Error Loading Categories
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="relative">
          {/* Enhanced Background Decorations */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 max-w-lg mx-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl mb-8 shadow-xl">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                No Categories Found
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Please check back later for our exciting categories.
              </p>
              <Link href="/products">
                <motion.button
                  className="bg-black text-white px-8 py-3 rounded-xl font-medium shadow-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative">Browse All Products</span>
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <CategoryCard category={category} index={index} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
