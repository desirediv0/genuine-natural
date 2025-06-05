"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { fetchApi } from "@/lib/utils";
import Image from "next/image";
import {
  Eye,
  Heart,
  Star,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import { toast } from "sonner";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [error, setError] = useState("");
  const [removingItems, setRemovingItems] = useState(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/wishlist");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;

      setLoadingItems(true);
      setError("");

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        setWishlistItems(response.data.wishlistItems || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load your wishlist. Please try again later.");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    setRemovingItems((prev) => new Set(prev).add(wishlistItemId));

    try {
      await fetchApi(`/users/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Remove the item from state
      setWishlistItems((current) =>
        current.filter((item) => item.id !== wishlistItemId)
      );
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      setError("Failed to remove item. Please try again.");
      toast.error("Failed to remove item from wishlist");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wishlistItemId);
        return newSet;
      });
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
        <div className="container mx-auto py-10 flex justify-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ClientOnly>
        <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-full mb-4 sm:mb-6">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
              My Wishlist
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Your saved favorites - ready when you are
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-900 text-red-900 px-4 sm:px-6 py-3 sm:py-4 rounded-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-red-900"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loadingItems ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 sm:p-12 flex justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 sm:p-12 text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4 sm:mb-6">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Save your favorite items to your wishlist for easy access later.
              </p>
              <Link href="/products">
                <Button className="bg-black hover:bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Stats */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {wishlistItems.length}{" "}
                      {wishlistItems.length === 1 ? "Item" : "Items"} Saved
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Your favorite products are waiting for you
                    </p>
                  </div>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white overflow-hidden transition-all hover:shadow-xl shadow-md rounded-lg border border-gray-100 group"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gray-50 overflow-hidden">
                        <Image
                          src={
                            product.images[0] ||
                            "/placeholder.svg?height=300&width=400"
                          }
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300">
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center py-3 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-transparent group-hover:text-white hover:bg-white/20 rounded-full p-2"
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickView(product);
                              }}
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-transparent group-hover:text-white hover:bg-white/20 rounded-full p-2 mx-2"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromWishlist(product.id);
                              }}
                              disabled={removingItems.has(product.id)}
                            >
                              {removingItems.has(product.id) ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Remove button - always visible on mobile */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromWishlist(product.id);
                          }}
                          disabled={removingItems.has(product.id)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md transition-all sm:opacity-0 group-hover:opacity-100"
                        >
                          {removingItems.has(product.id) ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </Link>

                    <div className="p-4 sm:p-6 text-center">
                      <div className="flex items-center justify-center mb-2 sm:mb-3">
                        <div className="flex text-black">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 sm:h-4 sm:w-4"
                              fill={
                                i < Math.round(product.avgRating || 0)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          ({product.reviewCount || 0})
                        </span>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:text-gray-600 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">
                          {product.name}
                        </h3>
                      </Link>

                      {product.flavors > 1 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full mb-3 sm:mb-4 inline-block">
                          {product.flavors} variants
                        </span>
                      )}

                      <div className="flex space-x-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-black hover:bg-gray-900 text-white text-xs sm:text-sm rounded-lg font-medium transition-colors">
                            View Product
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Quick View Dialog */}
          <ProductQuickView
            product={quickViewProduct}
            open={quickViewOpen}
            onOpenChange={setQuickViewOpen}
          />
        </div>
      </ClientOnly>
    </div>
  );
}
