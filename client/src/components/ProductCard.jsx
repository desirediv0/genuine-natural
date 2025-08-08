"use client";
import { formatCurrency, fetchApi } from "@/lib/utils";
import { Eye, Heart, Star } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductQuickView from "./ProductQuickView";
import { useAddProductToCart } from "@/lib/cart-utils";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

// Helper function to calculate discount percentage
const calculateDiscountPercentage = (regularPrice, salePrice) => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

const ProductCard = ({ product }) => {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { addProductToCart } = useAddProductToCart();

  // Fetch wishlist status for this product
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isAuthenticated || typeof window === "undefined") return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });
        const items = response.data.wishlistItems.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {});
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [isAuthenticated]);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  // Handle add to cart click
  const handleAddToCart = async (product) => {
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const result = await addProductToCart(product, 1);
      if (!result.success) {
        // Error is already handled in the utility function
        return;
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = async (product, e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: true }));

    try {
      if (wishlistItems[product.id]) {
        // Get wishlist to find the item ID
        const wishlistResponse = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );

        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          setWishlistItems((prev) => ({ ...prev, [product.id]: false }));
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Count variants
  const variantCount = product.variants ? product.variants.length : 0;

  return (
    <div
      key={product.id}
      className="bg-white overflow-hidden transition-all hover:shadow-lg shadow-md rounded-sm group h-full flex flex-col min-h-[450px]"
    >
      {/* Product Image Section */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={(() => {
              // Find the variant with the lowest weight
              let selectedVariant = null;
              if (product.variants && product.variants.length > 0) {
                selectedVariant = product.variants.reduce((min, v) => {
                  if (!v.weight || typeof v.weight.value !== "number")
                    return min;
                  if (!min || (min.weight && v.weight.value < min.weight.value))
                    return v;
                  return min;
                }, null);
                // fallback: if no variant has weight, use first variant
                if (!selectedVariant) selectedVariant = product.variants[0];
              }
              if (
                selectedVariant &&
                selectedVariant.images &&
                selectedVariant.images.length > 0
              ) {
                const primaryImg = selectedVariant.images.find(
                  (img) => img.isPrimary
                );
                if (primaryImg && primaryImg.url)
                  return getImageUrl(primaryImg.url);
                if (selectedVariant.images[0].url)
                  return getImageUrl(selectedVariant.images[0].url);
              }
              if (product.image) return getImageUrl(product.image);
              return "/placeholder.jpg";
            })()}
            alt={product.name}
            fill
            className="object-contain px-4 transition-transform md:group-hover:scale-105 scale-150 md:scale-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* SALE Badge - Top Left */}
        {product.hasSale && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-sm">
              SALE
            </div>
          </div>
        )}

        {/* Eye Icon - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuickView(product);
            }}
            className="bg-white border border-gray-300 p-1.5 rounded-sm hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 text-black" />
          </button>
        </div>

        {/* Wishlist Icon - Top Right (next to eye icon) */}
        <div className="absolute top-3 right-12 z-10">
          <button
            onClick={(e) => handleAddToWishlist(product, e)}
            disabled={isAddingToWishlist[product.id]}
            className={`bg-white border border-gray-300 p-1.5 rounded-sm hover:bg-gray-50 transition-colors ${
              wishlistItems[product.id] ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                wishlistItems[product.id] ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 text-center flex-1 flex flex-col justify-between">
        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="hover:text-primary mb-2"
        >
          <h3 className="font-medium text-sm text-black line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex text-gray-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-center mb-2 min-h-[2rem]">
          {product.hasSale ? (
            <div className="flex items-center gap-2 md:flex-row flex-col">
              <span className="font-bold text-lg text-black">
                {formatCurrency(product.basePrice)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                {formatCurrency(product.regularPrice)}
              </span>
            </div>
          ) : (
            <span className="font-bold text-lg text-black">
              {formatCurrency(product.basePrice)}
            </span>
          )}
        </div>

        {/* Variants */}
        {variantCount > 1 && (
          <span className="text-xs text-gray-500 mb-3">
            {variantCount} variants
          </span>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={() => handleAddToCart(product)}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isAddingToCart[product.id]}
        >
          {isAddingToCart[product.id] ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span className="text-sm">Adding...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Add to Cart</span>
            </div>
          )}
        </Button>
      </div>

      {/* Quick View Dialog */}
      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </div>
  );
};

export default ProductCard;
