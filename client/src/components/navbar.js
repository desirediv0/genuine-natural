"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  Phone,
  MapPin,
  LogIn,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchExpanded(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown);
    if (dropdown) {
      setActiveDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null);
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null);
    }
  };

  const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    handleLogout,
  }) => {
    const mobileSearchInputRef = useRef(null);

    useEffect(() => {
      if (isMenuOpen) {
        const timer = setTimeout(() => {
          if (mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [isMenuOpen]);

    const handleMobileSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setIsMenuOpen(false);
        setSearchQuery("");
      }
    };

    const handleSearchInputChange = (e) => {
      e.stopPropagation();
      setSearchQuery(e.target.value);
    };

    if (!isMenuOpen) return null;

    return (
      <div
        className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-black border-b border-gray-800 flex justify-between items-center px-6 py-5 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2.5 rounded-xl shadow-lg">
                  <ShoppingBag className="h-7 w-7 text-black" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Power Fitness
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gradient-to-b from-gray-50 to-white">
            <form onSubmit={handleMobileSearch} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    ref={mobileSearchInputRef}
                    type="text"
                    placeholder="Search for fitness products..."
                    className="w-full pl-14 pr-16 py-5 text-base border-0 focus:ring-0 focus:outline-none bg-transparent"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    autoComplete="off"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery("");
                        if (mobileSearchInputRef.current) {
                          mobileSearchInputRef.current.focus();
                        }
                      }}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-200 shadow-lg"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Link
                href="/products"
                className="flex items-center justify-between py-4 text-lg font-semibold hover:text-black transition-colors group"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>All Products</span>
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <Star className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-bold text-xl mb-5 text-gray-800 flex items-center">
                <div className="w-2 h-8 bg-black rounded-full mr-3"></div>
                Categories
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{category.name}</span>
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold group-hover:bg-black group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { href: "/blog", label: "Blog", icon: Star },
                { href: "/about", label: "About Us", icon: Heart },
                { href: "/shipping", label: "Shipping", icon: Zap },
                { href: "/contact", label: "Contact", icon: Phone },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-xl mb-5 text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-black rounded-full mr-3"></div>
                  My Account
                </h3>
                <div className="space-y-3">
                  {[
                    { href: "/account", label: "Profile" },
                    { href: "/account/orders", label: "My Orders" },
                    { href: "/wishlist", label: "My Wishlist" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-between p-4 text-red-600 hover:bg-red-50 w-full text-left transition-all duration-200 rounded-xl group"
                  >
                    <span className="font-medium">Logout</span>
                    <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-6 text-base bg-black hover:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                    Login to Your Account
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base border-2 border-black text-black hover:bg-black hover:text-white rounded-2xl font-semibold transition-all duration-200"
                  >
                    Create New Account
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="font-medium">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Find Store Near You</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Enhanced Top bar */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white px-4 py-3 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        <div className="relative flex items-center justify-center gap-3">
          <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
          <span className="font-semibold tracking-wide text-sm md:text-base">
            🎁 Free shipping on all orders over ₹999 | Limited Time Offer!
          </span>
          <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-lg" ref={navbarRef}>
        <Toaster position="top-center" />

        {/* Enhanced Main navbar */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex justify-between items-center h-18 md:h-24">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none group"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Enhanced Logo */}
              <Link href="/" className="flex items-center group">
                
                <div className="">
                  <Image
                    src="/logo.png"
                    alt="PowerFuel Logo"
                    width={120}
                    height={140}
                    className="mb-4"
                  />
                </div>
              </Link>

              {/* Enhanced Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Link
                  href="/products"
                  className="px-6 py-3 font-semibold text-gray-700 hover:text-black transition-all duration-200 relative group rounded-xl hover:bg-gray-50"
                >
                  All Products
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-8 transition-all duration-300"></span>
                </Link>

                {/* Enhanced Categories dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("categories")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`px-6 py-3 font-semibold ${
                      activeDropdown === "categories"
                        ? "text-black bg-gray-50"
                        : "text-gray-700 hover:text-black hover:bg-gray-50"
                    } transition-all duration-200 flex items-center focus:outline-none rounded-xl relative group`}
                    onClick={() => toggleDropdown("categories")}
                    aria-expanded={activeDropdown === "categories"}
                  >
                    Categories
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-all duration-300 ${
                        activeDropdown === "categories" ? "rotate-180" : ""
                      }`}
                    />
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-8 transition-all duration-300"></span>
                  </button>
                  <div
                    className={`absolute left-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 z-50 transition-all duration-300 ease-out transform origin-top ${
                      activeDropdown === "categories"
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="px-6 py-3 border-b border-gray-100">
                      <h3 className="font-bold text-lg text-gray-800">
                        Shop by Category
                      </h3>
                    </div>
                    <div className="py-2">
                      {categories.map((category, index) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="font-medium">{category.name}</span>
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold group-hover:bg-black group-hover:text-white transition-all">
                            {index + 1}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-6 py-3 border-t border-gray-100">
                      <Link
                        href="/categories"
                        className="flex items-center justify-center w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
                        onClick={() => setActiveDropdown(null)}
                      >
                        View All Categories
                      </Link>
                    </div>
                  </div>
                </div>

                {[
                  { href: "/blog", label: "Blog" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-6 py-3 font-semibold text-gray-700 hover:text-black transition-all duration-200 relative group rounded-xl hover:bg-gray-50"
                  >
                    {item.label}
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-8 transition-all duration-300"></span>
                  </Link>
                ))}
              </nav>

              {/* Enhanced Search, Cart, Account */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Enhanced Search */}
                <div className="relative">
                  {isSearchExpanded ? (
                    <>
                      <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsSearchExpanded(false)}
                      />
                      <div className="fixed inset-x-0 top-0 z-50 w-full animate-in slide-in-from-top duration-300 p-4">
                        <form
                          onSubmit={handleSearch}
                          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-2xl mx-auto"
                        >
                          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-black to-gray-800 text-white">
                            <div>
                              <h3 className="text-xl font-bold">
                                Search Products
                              </h3>
                              <p className="text-sm text-gray-300 mt-1">
                                Find your perfect fitness gear
                              </p>
                            </div>
                            <button
                              type="button"
                              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                              onClick={() => setIsSearchExpanded(false)}
                              aria-label="Close search"
                            >
                              <X className="h-6 w-6" />
                            </button>
                          </div>

                          <div className="p-6">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                              <div className="relative">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                                <Input
                                  ref={searchInputRef}
                                  type="search"
                                  placeholder="Search for protein, equipment, supplements..."
                                  className="w-full pl-14 pr-14 py-5 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-2xl text-lg font-medium"
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  autoComplete="off"
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* <div className="mt-6">
                              <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                                Popular Searches
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {[
                                  "Protein Powder",
                                  "Dumbbells",
                                  "Resistance Bands",
                                  "Pre-Workout",
                                  "Yoga Mats",
                                  "Supplements",
                                ].map((term) => (
                                  <button
                                    key={term}
                                    type="button"
                                    onClick={() => {
                                      setSearchQuery(term);
                                      handleSearch({
                                        preventDefault: () => {},
                                      });
                                    }}
                                    className="px-4 py-2 text-sm border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div> */}
                          </div>

                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setIsSearchExpanded(false)}
                              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl"
                            >
                              <Search className="h-5 w-5" />
                              Search Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none group"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

                {/* Enhanced Wishlist */}
                <Link
                  href="/wishlist"
                  className="p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 group relative"
                >
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Link>

                {/* Enhanced Cart */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 relative group"
                  >
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {cart && cart.items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-black to-gray-800 text-white rounded-full text-xs min-w-[22px] h-6 flex items-center justify-center px-2 font-bold shadow-lg animate-pulse">
                        {cart.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Enhanced Account dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("account")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <ClientOnly>
                    <button
                      className={`p-3 ${
                        activeDropdown === "account"
                          ? "text-black bg-gray-100"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      } rounded-xl transition-all duration-200 flex items-center focus:outline-none group`}
                      onClick={() => toggleDropdown("account")}
                      aria-expanded={activeDropdown === "account"}
                    >
                      {isAuthenticated ? (
                        <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      ) : (
                        <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      )}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-all duration-300 ${
                          activeDropdown === "account" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 z-50 transition-all duration-300 ease-out transform origin-top ${
                        activeDropdown === "account"
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">
                                  Hi, {user?.name || "User"}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="py-2">
                            <Link
                              href="/account"
                              className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="font-medium">My Account</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                              href="/account/orders"
                              className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="font-medium">My Orders</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                              href="/wishlist"
                              className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="font-medium">My Wishlist</span>
                              <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                          <div className="px-6 py-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                handleLogout();
                                setActiveDropdown(null);
                              }}
                              className="w-full py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl font-semibold"
                            >
                              Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-6 py-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-4">
                              Welcome Back!
                            </h3>
                            <div className="space-y-3">
                              <Link
                                href="/login"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Button className="w-full py-3 bg-black hover:bg-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                  Login to Account
                                </Button>
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full py-3 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl font-semibold transition-all duration-200"
                                >
                                  Create Account
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <ClientOnly>
          <MobileMenu
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            categories={categories}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isAuthenticated={isAuthenticated}
            user={user}
            cart={cart}
            handleLogout={handleLogout}
          />
        </ClientOnly>
      </header>
    </>
  );
}
