"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { fetchApi, formatCurrency, loadScript } from "@/lib/utils";
import { playSuccessSound, fireConfetti } from "@/lib/sound-utils";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle,
  MapPin,
  Plus,
  IndianRupee,
  ShoppingBag,
  PartyPopper,
  Gift,
  Shield,
  Truck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import Image from "next/image";

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { cart, coupon, getCartTotals, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [razorpayKey, setRazorpayKey] = useState("");
  const [error, setError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [confettiCannon, setConfettiCannon] = useState(false);

  const totals = getCartTotals();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=checkout");
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isAuthenticated && cart.items?.length === 0) {
      router.push("/cart");
    }
  }, [isAuthenticated, cart, router]);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!isAuthenticated) return;

    setLoadingAddresses(true);
    try {
      const response = await fetchApi("/users/addresses", {
        credentials: "include",
      });

      if (response.success) {
        setAddresses(response.data.addresses || []);

        if (response.data.addresses?.length > 0) {
          const defaultAddress = response.data.addresses.find(
            (addr) => addr.isDefault
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else {
            setSelectedAddressId(response.data.addresses[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated]);

  // Fetch Razorpay key
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await fetchApi("/payment/razorpay-key", {
          credentials: "include",
        });
        if (response.success) {
          setRazorpayKey(response.data.key);
        }
      } catch (error) {
        console.error("Error fetching Razorpay key:", error);
      }
    };

    if (isAuthenticated) {
      fetchRazorpayKey();
    }
  }, [isAuthenticated]);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    fetchAddresses();
  };

  // Add countdown for redirect
  useEffect(() => {
    if (orderCreated && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (orderCreated && redirectCountdown === 0) {
      router.push(`/account/orders`);
    }
  }, [orderCreated, redirectCountdown, router]);

  // Enhanced confetti effect when order is successful
  useEffect(() => {
    if (successAnimation) {
      fireConfetti.celebration();

      const timer = setTimeout(() => {
        setConfettiCannon(true);
        fireConfetti.sides();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successAnimation]);

  const handleSuccessfulPayment = (paymentResponse, orderData) => {
    setPaymentId(paymentResponse.razorpay_payment_id);
    setOrderCreated(true);
    setOrderNumber(orderData.orderNumber || "");

    setSuccessAnimation(true);
    playSuccessSound();
    clearCart();

    toast.success("Order placed successfully!", {
      duration: 4000,
      icon: <PartyPopper className="h-5 w-5 text-green-500" />,
      description: `Your order #${
        orderData.orderNumber || ""
      } has been confirmed.`,
    });
  };

  // Process checkout
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const calculatedAmount = totals.subtotal - totals.discount;
      const amount = Math.max(
        Number.parseFloat(calculatedAmount.toFixed(2)),
        1
      );

      if (calculatedAmount < 1) {
        toast.info("Minimum order amount is ₹1. Your total has been adjusted.");
      }

      if (paymentMethod === "RAZORPAY") {
        const orderResponse = await fetchApi("/payment/checkout", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency: "INR",
            couponCode: coupon?.code || null,
            couponId: coupon?.id || null,
            discountAmount: totals.discount || 0,
          }),
        });

        if (!orderResponse.success) {
          throw new Error(orderResponse.message || "Failed to create order");
        }

        const razorpayOrder = orderResponse.data;
        setOrderId(razorpayOrder.id);

        const loaded = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!loaded) {
          throw new Error("Razorpay SDK failed to load");
        }

        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Being Genuine Natural - Premium Supplements for Your Fitness Journey",
          description: "Get high-quality supplements at the best prices.",
          order_id: razorpayOrder.id,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          handler: async (response) => {
            try {
              const verificationResponse = await fetchApi("/payment/verify", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  shippingAddressId: selectedAddressId,
                  billingAddressSameAsShipping: true,
                  couponCode: coupon?.code || null,
                  couponId: coupon?.id || null,
                  discountAmount: totals.discount || 0,
                  notes: "",
                }),
              });

              if (verificationResponse.success) {
                setOrderId(verificationResponse.data.orderId);
                handleSuccessfulPayment(response, verificationResponse.data);
              } else {
                throw new Error(
                  verificationResponse.message || "Payment verification failed"
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);

              if (
                error.message &&
                error.message.includes("previously cancelled")
              ) {
                setError(
                  "Your previous order was cancelled. Please refresh the page and try again."
                );
                toast.error("Please refresh the page to start a new checkout", {
                  duration: 6000,
                });
              } else {
                setError(error.message || "Payment verification failed");
              }
            }
          },
          theme: {
            color: "#000000",
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (
        error.message &&
        error.message.includes("order was previously cancelled")
      ) {
        setError(
          "This order was previously cancelled. Please refresh the page to start a new checkout."
        );
        toast.error("Please refresh the page to start a new checkout", {
          duration: 6000,
        });
      } else {
        setError(error.message || "Checkout failed");
        toast.error(error.message || "Checkout failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Loading state UI
  if (!isAuthenticated || loadingAddresses) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Order success UI
  if (orderCreated) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50 opacity-50"></div>

            <div className="relative z-10">
              <div className="relative flex justify-center mb-8">
                <div className="h-32 w-32 bg-black rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <PartyPopper className={`h-16 w-16 text-white ${confettiCannon ? "animate-pulse" : ""}`} />
                </div>
              </div>

              <div className="text-center space-y-6">
                <div>
                  <h1 className="text-5xl font-bold mb-2 text-black">Success</h1>
                  <p className="text-xl text-gray-600">Order Confirmed</p>
                </div>

                {orderNumber && (
                  <div className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full">
                    <span className="text-lg font-medium">Order #{orderNumber}</span>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-2xl">
                  <CheckCircle className="h-6 w-6" />
                  <p className="text-lg font-medium">Payment Successful</p>
                </div>

                <p className="text-gray-600 max-w-md mx-auto">
                  Thank you for your purchase! We've sent you an email with order details and tracking information.
                </p>

                <div className="flex items-center justify-center space-x-2 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Redirecting in {redirectCountdown} seconds...</p>
                </div>

                <div className="flex justify-center gap-4">
                  <Link href="/account/orders">
                    <Button className="bg-black hover:bg-gray-900 text-white px-8 py-6 rounded-xl text-lg">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      View Orders
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-6 rounded-xl text-lg">
                      <Gift className="mr-2 h-5 w-5" />
                      Shop More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout UI
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold text-black">Checkout</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-black" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-black" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-red-50 rounded-2xl flex items-start">
              <AlertCircle className="text-red-500 mt-1 mr-4 flex-shrink-0 h-6 w-6" />
              <div>
                <p className="text-lg font-semibold text-red-700">Payment Failed</p>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main checkout area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Addresses */}
              <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center text-black">
                    <MapPin className="h-7 w-7 mr-3" />
                    Delivery Address
                  </h2>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Address
                  </Button>
                </div>

                {showAddressForm && (
                  <div className="mb-8">
                    <AddressForm
                      onSuccess={handleAddressFormSuccess}
                      onCancel={() => setShowAddressForm(false)}
                      isInline={true}
                    />
                  </div>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                    <p className="text-gray-600 text-lg">
                      No addresses saved yet.{" "}
                      <button
                        className="font-medium text-black underline hover:text-gray-700"
                        onClick={() => setShowAddressForm(true)}
                      >
                        Add your first address
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showAddressForm ? "mt-8" : ""}`}>
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                          selectedAddressId === address.id
                            ? "border-black bg-gray-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => handleAddressSelect(address.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-lg font-bold text-black">{address.name}</span>
                          {address.isDefault && (
                            <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <p className="text-base">{address.street}</p>
                          <p className="text-base">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-base">{address.country}</p>
                          <p className="text-base font-medium mt-4">
                            📞 {address.phone || "Not provided"}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center">
                          <input
                            type="radio"
                            name="addressSelection"
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                            className="h-5 w-5 text-black border-gray-300 focus:ring-black"
                          />
                          <label className="ml-3 text-base font-medium text-gray-700">
                            Deliver to this address
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8">
                <h2 className="text-2xl font-bold flex items-center mb-8 text-black">
                  <CreditCard className="h-7 w-7 mr-3" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                      paymentMethod === "RAZORPAY"
                        ? "border-black bg-gray-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handlePaymentMethodSelect("RAZORPAY")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          id="razorpay"
                          name="paymentMethod"
                          checked={paymentMethod === "RAZORPAY"}
                          onChange={() => handlePaymentMethodSelect("RAZORPAY")}
                          className="h-5 w-5 text-black border-gray-300 focus:ring-black"
                        />
                        <label htmlFor="razorpay" className="ml-3">
                          <span className="text-lg font-bold text-black">Pay Online</span>
                          <span className="ml-3 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                            Recommended
                          </span>
                        </label>
                      </div>
                      <IndianRupee className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-base text-gray-600 mt-3 ml-8">
                      Secure payment via Credit/Debit Card, UPI, or NetBanking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sticky top-8">
                <h2 className="text-2xl font-bold mb-8 text-black">Order Summary</h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-base font-medium text-gray-600 mb-4">
                      {cart.totalQuantity} {cart.totalQuantity === 1 ? 'Item' : 'Items'} in Cart
                    </p>
                    <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                      {cart.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-50 rounded-xl flex-shrink-0 relative">
                            {item.product.image && (
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-contain p-2"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-black truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="text-base font-bold text-black">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold text-black">
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>

                    {coupon && (
                      <div className="flex justify-between text-base">
                        <span className="text-green-600">Discount Applied</span>
                        <span className="font-bold text-green-600">
                          -{formatCurrency(totals.discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="flex items-center text-green-600 font-bold">
                        <Gift className="h-5 w-5 mr-2" />
                        FREE
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-black">Total</span>
                        <span className="text-2xl font-bold text-black">
                          {formatCurrency(totals.subtotal - totals.discount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-16 bg-black hover:bg-gray-900 text-white text-lg font-bold rounded-2xl
                    transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:scale-100 flex items-center justify-center gap-3"
                    onClick={handleCheckout}
                    disabled={
                      processing ||
                      !selectedAddressId ||
                      !paymentMethod ||
                      addresses.length === 0
                    }
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-6 w-6" />
                        <span>Place Secure Order</span>
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    By placing your order, you agree to our Terms & Conditions
                  </p>

                  {/* Security Badges */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex flex-col items-center">
                        <Shield className="h-8 w-8 text-black mb-2" />
                        <span className="text-sm text-gray-600 text-center">
                          Secure
                          <br />
                          Payment
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Truck className="h-8 w-8 text-black mb-2" />
                        <span className="text-sm text-gray-600 text-center">
                          Free
                          <br />
                          Shipping
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Clock className="h-8 w-8 text-black mb-2" />
                        <span className="text-sm text-gray-600 text-center">
                          Fast
                          <br />
                          Delivery
                        </span>
                      </div>
                    </div>
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
