"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Star,
  AlertCircle,
  Eye,
  Heart,
  Filter,
  Grid3X3,
  List,
  ShoppingBag,
  Package,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

// Helper function to get the best variant for display
const getBestVariant = (variants) => {
  if (!variants || variants.length === 0) return null;

  // Find the variant with the lowest sale price, or regular price if no sale
  return variants.reduce((best, current) => {
    const currentPrice = parseFloat(current.salePrice || current.price);
    const bestPrice = parseFloat(best.salePrice || best.price);
    return currentPrice < bestPrice ? current : best;
  });
};

// Helper function to get product display data
const getProductDisplayData = (product) => {
  const bestVariant = getBestVariant(product.variants);

  if (!bestVariant) {
    return {
      image: product.image || "/placeholder.jpg",
      basePrice: 0,
      regularPrice: 0,
      hasSale: false,
      salePrice: 0,
    };
  }

  const basePrice = parseFloat(bestVariant.salePrice || bestVariant.price);
  const regularPrice = parseFloat(bestVariant.price);
  const hasSale =
    bestVariant.salePrice &&
    parseFloat(bestVariant.salePrice) < parseFloat(bestVariant.price);

  // Get the primary image from the best variant
  const primaryImage =
    bestVariant.images?.find((img) => img.isPrimary)?.url ||
    bestVariant.images?.[0]?.url ||
    product.image ||
    "/placeholder.jpg";

  return {
    image: primaryImage,
    basePrice,
    regularPrice,
    hasSale,
    salePrice: hasSale ? parseFloat(bestVariant.salePrice) : basePrice,
  };
};

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Parse sort option into API parameters
        let sort = "createdAt";
        let order = "desc";

        switch (sortOption) {
          case "newest":
            sort = "createdAt";
            order = "desc";
            break;
          case "oldest":
            sort = "createdAt";
            order = "asc";
            break;

          case "name-asc":
            sort = "name";
            order = "asc";
            break;
          case "name-desc":
            sort = "name";
            order = "desc";
            break;
          default:
            break;
        }

        const response = await fetchApi(
          `/public/categories/${slug}/products?page=${pagination.page}&limit=${pagination.limit}&sort=${sort}&order=${order}`
        );

        setCategory(response.data.category);
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || pagination);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug, sortOption, pagination.page, pagination.limit]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Loading state
  if (loading && !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-black border-t-transparent rounded-full mb-6"
            />
            <p className="text-gray-600 text-lg font-medium">
              Loading category...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl border border-red-200 shadow-lg flex items-start max-w-2xl mx-auto"
          >
            <AlertCircle className="text-red-500 mr-4 mt-1 flex-shrink-0 h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-3">
                Category Not Found
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Link href="/products">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Browse All Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8 text-sm text-gray-500"
        >
          <Link
            href="/"
            className="hover:text-black transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href="/products"
            className="hover:text-black transition-colors font-medium"
          >
            Products
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-black font-semibold">{category?.name}</span>
        </motion.div>

        {/* Category Header */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-white   border-gray-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-black/5 to-transparent rounded-bl-full"></div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative">
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full mb-6"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Category</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900"
                  >
                    {category.name}
                  </motion.h1>

                  {category.description && (
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-lg max-w-2xl leading-relaxed"
                    >
                      {category.description}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center mt-6 text-sm text-gray-500"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    <span>
                      {pagination.total || products.length} products available
                    </span>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-40 h-40 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-lg border border-gray-200"
                >
                  <Image
                    src={getImageUrl(category.image) || "/placeholder.jpg"}
                    alt={category.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Sort by:</span>
              </div>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none bg-white font-medium"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>

                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">View:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-all ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-all ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse"
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product, index) => {
                const displayData = getProductDisplayData(product);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list" ? "w-80 h-80" : "h-80"
                      } overflow-hidden`}
                    >
                      <Image
                        src={getImageUrl(displayData.image)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {displayData.hasSale && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            SALE
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4"
                              fill={
                                i < Math.round(product.avgRating || 0)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product._count?.reviews || 0})
                        </span>
                      </div>

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {viewMode === "list" && product.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {displayData.hasSale ? (
                            <>
                              <span className="font-bold text-xl text-black">
                                {formatCurrency(displayData.salePrice)}
                              </span>
                              <span className="text-gray-500 line-through text-sm">
                                {formatCurrency(displayData.regularPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-xl text-gray-900">
                              {formatCurrency(displayData.basePrice)}
                            </span>
                          )}
                        </div>

                        <Link href={`/products/${product.slug}`}>
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white rounded-xl font-semibold group/btn"
                          >
                            View
                            <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-16"
              >
                <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-gray-100 font-semibold"
                  >
                    Previous
                  </Button>

                  {[...Array(pagination.pages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        pagination.page === index + 1 ? "default" : "ghost"
                      }
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        pagination.page === index + 1
                          ? "bg-black text-white shadow-lg"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-gray-100 font-semibold"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-8"
            >
              <ShoppingBag className="h-10 w-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              This category doesn&apos;t have any products yet.
            </p>

            <Link href="/products">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                <ArrowRight className="mr-2 h-5 w-5" />
                Browse All Products
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Quick View Modal */}
        <ProductQuickView
          product={quickViewProduct}
          isOpen={quickViewOpen}
          onClose={() => {
            setQuickViewOpen(false);
            setQuickViewProduct(null);
          }}
        />
      </div>
    </div>
  );
}
