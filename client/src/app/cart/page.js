"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Tag,
  Gift,
  ArrowRight,
  Heart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const CartItem = React.memo(
  ({ item, onUpdateQuantity, onRemove, isLoading }) => {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 flex items-center space-x-6">
            <div className="relative h-24 w-24 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={getImageUrl(item.product.image)}
                alt={item.product.name}
                fill
                className="object-contain p-3"
              />
            </div>
            <div className="flex-1">
              <Link
                href={`/products/${item.product.slug}`}
                className="text-lg font-semibold text-gray-800 hover:text-black transition-colors line-clamp-2 hover:underline decoration-gray-400"
              >
                {item.product.name}
              </Link>
              <div className="text-sm text-gray-500 mt-2 flex items-center space-x-3">
                <span className="px-3 py-1 bg-gray-50 rounded-full text-gray-700">
                  {item.variant.flavor?.name}
                </span>
                <span>•</span>
                <span className="px-3 py-1 bg-gray-50 rounded-full">
                  {item.variant.weight?.value}
                  {item.variant.weight?.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between md:justify-center">
            <span className="md:hidden text-sm font-medium text-gray-600">
              Price:
            </span>
            <span className="font-semibold text-gray-800 text-lg">
              {formatCurrency(item.price)}
            </span>
          </div>

          <div className="md:col-span-2 flex items-center justify-between md:justify-center">
            <span className="md:hidden text-sm font-medium text-gray-600">
              Quantity:
            </span>
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                className="p-2.5 hover:bg-gray-200/50 disabled:opacity-50 rounded-l-xl transition-colors"
                disabled={isLoading || item.quantity <= 1}
              >
                <Minus className="h-4 w-4 text-gray-700" />
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center font-semibold text-gray-800">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline text-gray-600" />
                ) : (
                  item.quantity
                )}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                className="p-2.5 hover:bg-gray-200/50 disabled:opacity-50 rounded-r-xl transition-colors"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-between md:justify-center">
            <div className="flex items-center md:block">
              <span className="md:hidden mr-2 text-sm font-medium text-gray-600">
                Subtotal:
              </span>
              <span className="font-bold text-xl text-black">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl ml-4 disabled:opacity-50 transition-all hover:scale-110"
              aria-label="Remove item"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
CartItem.displayName = "CartItem";

export default function CartPage() {
  const {
    cart,
    loading,
    cartItemsLoading,
    error,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    couponLoading,
    getCartTotals,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const router = useRouter();

  const handleQuantityChange = useCallback(
    async (cartItemId, currentQuantity, change) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity < 1) return;

      try {
        await updateCartItem(cartItemId, newQuantity);
        toast.success("Cart updated successfully");
      } catch (err) {
        console.error("Error updating quantity:", err);
        toast.error("Failed to update cart");
      }
    },
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId) => {
      try {
        await removeFromCart(cartItemId);
        toast.success("Item removed from cart");
      } catch (err) {
        console.error("Error removing item:", err);
        toast.error("Failed to remove item");
      }
    },
    [removeFromCart]
  );

  const handleClearCart = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        toast.success("Cart has been cleared");
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Failed to clear cart");
      }
    }
  }, [clearCart]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();

      if (!couponCode.trim()) {
        setCouponError("Please enter a coupon code");
        return;
      }

      setCouponError("");

      try {
        const response = await applyCoupon(couponCode);
        setCouponCode("");
        toast.success("Coupon applied successfully");
      } catch (err) {
        setCouponError(err.message || "Invalid coupon code");
        toast.error(err.message || "Invalid coupon code");
      }
    },
    [couponCode, applyCoupon]
  );

  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  }, [removeCoupon]);

  const totals = useMemo(() => getCartTotals(), [getCartTotals, cart, coupon]);

  const handleCheckout = useCallback(() => {
    const calculatedAmount = totals.subtotal - totals.discount;
    if (calculatedAmount < 1) {
      toast.info("Minimum order amount is ₹1");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=checkout");
    } else {
      router.push("/checkout");
    }
  }, [isAuthenticated, router, totals]);

  if (loading && !cart.items?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if ((!cart?.items || cart.items.length === 0) && !loading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100 max-w-md mx-auto">
            <div className="inline-flex justify-center items-center bg-gray-100 p-6 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <div className="text-sm bg-gray-100 px-4 py-2 rounded-full text-gray-700 font-medium">
            {cart.items?.length} {cart.items?.length === 1 ? "item" : "items"}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl flex items-start mb-8 shadow-sm">
            <AlertCircle className="text-red-500 mr-4 mt-0.5 flex-shrink-0 h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">Cart Error</h2>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 font-semibold text-gray-800">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Subtotal</div>
            </div>

            <div className="space-y-6">
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    isLoading={cartItemsLoading[item.id]}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items in cart</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 shadow-sm">
              <Link href="/products">
                <Button
                  variant="outline"
                  className="border-2  border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-500 border-2 border-red-200 hover:bg-red-50 hover:text-red-500 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin " />
                ) : null}
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                Order Summary
              </h2>

              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-4 flex items-center text-gray-700">
                  <Tag className="h-5 w-5 mr-2 text-gray-500" />
                  Apply Coupon
                </h3>
                {coupon ? (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-800 text-xl">
                          {coupon.code}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}% off`
                            : `₹${coupon.discountValue} off`}
                        </p>
                        {((Number.parseFloat(coupon.discountValue) > 90 &&
                          coupon.discountType === "PERCENTAGE") ||
                          coupon.isDiscountCapped) && (
                          <p className="text-xs text-gray-600 mt-2">
                            *Maximum discount capped at 90%
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-red-500 hover:text-red-700 font-medium hover:scale-110 transition-transform"
                        disabled={couponLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <form
                      onSubmit={handleApplyCoupon}
                      className="flex space-x-3"
                    >
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className={`flex-1 h-12 px-4 border-2 rounded-xl transition-colors ${
                          couponError
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-gray-500"
                        }`}
                      />
                      <Button
                        type="submit"
                        disabled={couponLoading}
                        className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 text-white px-6 rounded-xl hover:scale-105 transition-transform"
                      >
                        {couponLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </form>
                    <p className="text-xs text-gray-500 mt-3">
                      *Maximum discount limited to 90% of cart value
                    </p>
                    {couponError && (
                      <div className="mt-3 flex items-start gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">{couponError}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t-2 border-dashed border-gray-100 pt-6">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-lg">
                      {formatCurrency(totals.subtotal)}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Discount</span>
                      <span className="font-medium text-lg">
                        -{formatCurrency(totals.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600 font-semibold flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      FREE
                    </span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-2xl mt-8 pt-6 border-t-2 border-dashed border-gray-100">
                  <span>Total</span>
                  <span className="text-black">
                    {formatCurrency(totals.subtotal - totals.discount)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-8 h-14 bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                onClick={handleCheckout}
              >
                <span className="flex items-center justify-center">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Taxes and shipping calculated at checkout
              </p>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                    <Heart className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-xs text-gray-700 font-medium">
                      Secure Checkout
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                    <Gift className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-xs text-gray-700 font-medium">
                      Free Shipping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
