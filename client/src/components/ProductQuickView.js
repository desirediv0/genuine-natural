"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function ProductQuickView({ product, open, onOpenChange }) {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      setSelectedFlavor(null);
      setSelectedWeight(null);
      setSelectedVariant(null);
      setQuantity(1);
      setError(null);
      setSuccess(false);
      setProductDetails(null);
      setImgSrc("");
      setAvailableCombinations([]);
      setInitialLoading(true);
      return;
    }

    if (product) {
      // Set initial image when product changes
      setImgSrc(product.image || "/product-placeholder.jpg");
    }
  }, [product, open]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !open) return;

      setLoading(true);
      setInitialLoading(true);
      try {
        // Fetch detailed product info
        const response = await fetchApi(`/public/products/${product.slug}`);
        if (response.data && response.data.product) {
          const productData = response.data.product;
          setProductDetails(productData);

          // Update image if available
          if (productData.images && productData.images.length > 0) {
            setImgSrc(
              productData.images[0].url ||
                productData.image ||
                "/product-placeholder.jpg"
            );
          }

          // Extract all available combinations from variants
          if (productData.variants && productData.variants.length > 0) {
            const combinations = productData.variants
              .filter((v) => v.isActive && v.quantity > 0)
              .map((variant) => ({
                flavorId: variant.flavorId,
                weightId: variant.weightId,
                variant: variant,
              }));

            setAvailableCombinations(combinations);

            // Set default selections
            if (productData.flavorOptions?.length > 0) {
              const firstFlavor = productData.flavorOptions[0];
              setSelectedFlavor(firstFlavor);

              // Find matching weights for this flavor
              const matchingVariant = combinations.find(
                (combo) => combo.flavorId === firstFlavor.id
              );

              if (matchingVariant && productData.weightOptions) {
                const matchingWeight = productData.weightOptions.find(
                  (weight) => weight.id === matchingVariant.weightId
                );

                if (matchingWeight) {
                  setSelectedWeight(matchingWeight);
                  setSelectedVariant(matchingVariant.variant);
                }
              }
            } else if (productData.variants.length > 0) {
              // If no flavor/weight options but variants exist, use the first variant
              setSelectedVariant(productData.variants[0]);
            }
          }
        } else {
          setError("Product details not available");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProductDetails();
  }, [product, open]);

  // Get available weights for a specific flavor
  const getAvailableWeightsForFlavor = (flavorId) => {
    const availableWeights = availableCombinations
      .filter((combo) => combo.flavorId === flavorId)
      .map((combo) => combo.weightId);

    return availableWeights;
  };

  // Get available flavors for a specific weight
  const getAvailableFlavorsForWeight = (weightId) => {
    const availableFlavors = availableCombinations
      .filter((combo) => combo.weightId === weightId)
      .map((combo) => combo.flavorId);

    return availableFlavors;
  };

  // Check if a combination is available
  const isCombinationAvailable = (flavorId, weightId) => {
    return availableCombinations.some(
      (combo) => combo.flavorId === flavorId && combo.weightId === weightId
    );
  };

  // Handle flavor change
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);

    // Find available weights for this flavor
    const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);

    if (
      productDetails?.weightOptions?.length > 0 &&
      availableWeightIds.length > 0
    ) {
      // Use currently selected weight if it's compatible with the new flavor
      if (selectedWeight && availableWeightIds.includes(selectedWeight.id)) {
        // Current weight is compatible, keep it selected
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.flavorId === flavor.id && combo.weightId === selectedWeight.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        // Current weight is not compatible, switch to first available
        const firstAvailableWeight = productDetails.weightOptions.find(
          (weight) => availableWeightIds.includes(weight.id)
        );

        if (firstAvailableWeight) {
          setSelectedWeight(firstAvailableWeight);

          // Find the corresponding variant
          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.flavorId === flavor.id &&
              combo.weightId === firstAvailableWeight.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedWeight(null);
      setSelectedVariant(null);
    }
  };

  // Handle weight change
  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);

    // Find available flavors for this weight
    const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);

    if (
      productDetails?.flavorOptions?.length > 0 &&
      availableFlavorIds.length > 0
    ) {
      // Use currently selected flavor if it's compatible with the new weight
      if (selectedFlavor && availableFlavorIds.includes(selectedFlavor.id)) {
        // Current flavor is compatible, keep it selected
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.weightId === weight.id && combo.flavorId === selectedFlavor.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        // Current flavor is not compatible, switch to first available
        const firstAvailableFlavor = productDetails.flavorOptions.find(
          (flavor) => availableFlavorIds.includes(flavor.id)
        );

        if (firstAvailableFlavor) {
          setSelectedFlavor(firstAvailableFlavor);

          // Find the corresponding variant
          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.weightId === weight.id &&
              combo.flavorId === firstAvailableFlavor.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedFlavor(null);
      setSelectedVariant(null);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (
      selectedVariant &&
      selectedVariant.quantity > 0 &&
      newQuantity > selectedVariant.quantity
    )
      return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    setError(null);
    setSuccess(false);

    // If no variant is selected but product has variants, use the first one
    let variantToAdd = selectedVariant;

    if (!variantToAdd && productDetails?.variants?.length > 0) {
      variantToAdd = productDetails.variants[0];
    }

    if (!variantToAdd) {
      setError("No product variant available");
      setAddingToCart(false);
      return;
    }

    try {
      await addToCart(variantToAdd.id, quantity);
      setSuccess(true);

      // Auto close after success notification
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Format price display
  const getPriceDisplay = () => {
    // Show loading state while initial data is being fetched
    if (initialLoading || loading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    // If we have a selected variant, show its price
    if (selectedVariant) {
      if (selectedVariant.salePrice && selectedVariant.salePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#F47C20]">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2C3E50]">
          {formatCurrency(selectedVariant.price || 0)}
        </span>
      );
    }

    // If no variant but product details available, show base price
    if (productDetails) {
      if (productDetails.hasSale && productDetails.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#F47C20]">
              {formatCurrency(productDetails.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(productDetails.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2C3E50]">
          {formatCurrency(productDetails.basePrice || 0)}
        </span>
      );
    }

    // Fallback to product from props if no details fetched yet
    if (product) {
      if (product.hasSale && product.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#F47C20]">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(product.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2C3E50]">
          {formatCurrency(product.basePrice || 0)}
        </span>
      );
    }

    return null;
  };

  if (!product) return null;

  // Use the detailed product info if available, otherwise fall back to the basic product
  const displayProduct = productDetails || product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1100px] w-full max-h-[90vh] md:max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-black text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-light tracking-wider line-clamp-1">
              {displayProduct.name}
            </DialogTitle>
            {/* <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-white/10 rounded-full transition-all duration-300 group"
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-white transition-colors duration-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-white/10 rounded-full transition-all duration-300 group"
              >
                <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-white transition-colors duration-300" />
              </Button>
            </div> */}
          </div>
        </DialogHeader>

        {loading && !productDetails ? (
          <div className="py-16 md:py-32 flex justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 p-4 sm:p-6 md:p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-none overflow-hidden bg-gray-50 transition-shadow duration-300 group">
                <Image
                  src={imgSrc || "/placeholder.svg"}
                  alt={displayProduct.name}
                  fill
                  className="object-contain p-4 sm:p-6 md:p-8 transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 50vw"
                  onError={() => setImgSrc("/product-placeholder.jpg")}
                />
                {displayProduct.hasSale && (
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-black text-white text-xs sm:text-sm font-light tracking-wider px-4 sm:px-6 py-2 sm:py-3">
                    SALE
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-6 md:space-y-8">
              {/* Success Message */}
              {success && (
                <div className="p-3 md:p-4 bg-green-50 border-l-4 border-green-900 text-green-900 text-xs sm:text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="font-light tracking-wide">
                    Item added to cart successfully!
                  </span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 md:p-4 bg-red-50 border-l-4 border-red-900 text-red-900 text-xs sm:text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="font-light tracking-wide">{error}</span>
                </div>
              )}

              {/* Price */}
              <div className="border-b border-gray-200 pb-4 md:pb-6">
                {getPriceDisplay()}
              </div>

              {/* Rating */}
              {displayProduct.avgRating > 0 && (
                <div className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                          star <= Math.round(displayProduct.avgRating || 0)
                            ? "text-black fill-black"
                            : "text-gray-200"
                        } transform hover:scale-110 transition-transform duration-200`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 font-light tracking-wide">
                    {displayProduct.avgRating?.toFixed(1)} (
                    {displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Flavor selection */}
              {productDetails?.flavorOptions && productDetails.flavorOptions.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 tracking-wide uppercase">
                    Choose Flavor
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {productDetails.flavorOptions.map((flavor) => {
                      const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);
                      const isAvailable = availableWeightIds.length > 0;

                      return (
                        <button
                          key={flavor.id}
                          type="button"
                          onClick={() => handleFlavorChange(flavor)}
                          disabled={!isAvailable}
                          className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-light tracking-wider transition-all duration-300 ${
                            selectedFlavor?.id === flavor.id
                              ? "bg-black text-white"
                              : isAvailable
                              ? "border border-black hover:bg-black hover:text-white"
                              : "border border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {flavor.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight selection */}
              {productDetails?.weightOptions && productDetails.weightOptions.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 tracking-wide uppercase">
                    Choose Weight
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {productDetails.weightOptions.map((weight) => {
                      const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);
                      const isAvailable = selectedFlavor
                        ? availableCombinations.some(
                            (combo) =>
                              combo.flavorId === selectedFlavor.id &&
                              combo.weightId === weight.id
                          )
                        : availableFlavorIds.length > 0;

                      return (
                        <button
                          key={weight.id}
                          type="button"
                          onClick={() => handleWeightChange(weight)}
                          disabled={!isAvailable}
                          className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm font-light tracking-wider transition-all duration-300 ${
                            selectedWeight?.id === weight.id
                              ? "bg-black text-white"
                              : isAvailable
                              ? "border border-black hover:bg-black hover:text-white"
                              : "border border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {weight.value} {weight.unit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Availability */}
              {selectedVariant && (
                <div className="p-3 md:p-4 border-l-4 border-gray-900 bg-gray-50">
                  <span
                    className={`text-xs sm:text-sm font-light tracking-wide ${
                      selectedVariant.quantity > 0
                        ? "text-gray-900"
                        : "text-red-900"
                    }`}
                  >
                    {selectedVariant.quantity > 0
                      ? `✓ In Stock (${selectedVariant.quantity} available)`
                      : "✗ Out of Stock"}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3 md:space-y-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-900 tracking-wide uppercase">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 sm:p-3 md:p-4 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1 || loading}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <span className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 font-light text-gray-900 min-w-[3rem] sm:min-w-[4rem] text-center border-x border-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 sm:p-3 md:p-4 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        loading ||
                        (selectedVariant &&
                          selectedVariant.quantity > 0 &&
                          quantity >= selectedVariant.quantity)
                      }
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 pt-4 md:pt-6">
                <Button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 py-3 sm:py-4 md:py-6 bg-black text-white text-sm sm:text-base md:text-lg font-light tracking-wider hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loading ||
                    addingToCart ||
                    (!selectedVariant &&
                      (!productDetails?.variants ||
                        productDetails.variants.length === 0)) ||
                    (selectedVariant && selectedVariant.quantity < 1)
                  }
                >
                  {addingToCart ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Link href={`/products/${displayProduct.slug}`} className="w-full sm:flex-1">
                  <Button
                    variant="outline"
                    className="w-full py-3 sm:py-4 md:py-6 border border-black text-black hover:bg-black hover:text-white text-sm sm:text-base md:text-lg font-light tracking-wider transition-all duration-300"
                  >
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
