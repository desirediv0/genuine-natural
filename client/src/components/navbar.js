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
          <div className="sticky top-0 bg-gradient-to-r from-black  to-black  border-b border-black  flex justify-between items-center px-4 py-4 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Power Fitness
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-black to-white">
            <form onSubmit={handleMobileSearch} className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-4 text-base border-2 border-black  focus:border-black  focus:ring-black  rounded-xl bg-white"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  autoComplete="off"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      if (mobileSearchInputRef.current) {
                        mobileSearchInputRef.current.focus();
                      }
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black  text-white hover:bg-black  transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Link
                href="/products"
                className="block py-3 text-lg font-semibold hover:text-black  transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Categories
              </h3>
              <div className="space-y-2 pl-2">
                {categories.map((category) => (
                  <div key={category.id} className="py-1">
                    <Link
                      href={`/category/${category.slug}`}
                      className="block hover:text-black  text-base transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About Us" },
                { href: "/shipping", label: "Shipping Policy" },
                { href: "/contact", label: "Contact Us" },
              ].map((item) => (
                <div
                  key={item.href}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <Link
                    href={item.href}
                    className="block py-2 text-lg font-semibold hover:text-black  transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-3 text-gray-800">
                  My Account
                </h3>
                <div className="space-y-2 pl-2">
                  {[
                    { href: "/account", label: "Profile" },
                    { href: "/account/orders", label: "My Orders" },
                    { href: "/wishlist", label: "My Wishlist" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 hover:text-black  transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-red-600 hover:text-red-800 w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base border-2 border-black  text-black  hover:bg-black rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-6 text-base bg-gradient-to-r from-black  to-black  hover:from-black  hover:to-black  rounded-xl">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-5 w-5 text-black " />
                <span className="font-medium">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-black " />
                <span className="font-medium">Store Locator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-black text-white px-4 py-2.5 text-center text-sm font-medium tracking-wide ">
        <span className="inline-flex items-center gap-2">
          <span className="hidden sm:inline">🎁</span>
          Free shipping on all orders over ₹999
        </span>
      </div>

      <header className="sticky top-0 z-50 bg-white" ref={navbarRef}>
        <Toaster position="top-center" />

        {/* Main navbar */}
        <div className="border-b border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16 md:h-20">
              {/* Menu toggle for mobile */}
              <div className="flex items-center md:hidden">
                <button
                  className="p-2 hover:bg-black/5 rounded-lg transition-colors focus:outline-none"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  width={100}
                  height={100}
                  alt="Logo"
                  className="h-14 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/products"
                  className="font-medium text-gray-800 hover:text-black transition-colors relative group py-2"
                >
                  All Products
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>

                {/* Categories dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownHover("categories")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`font-medium ${
                      activeDropdown === "categories"
                        ? "text-black"
                        : "text-gray-800"
                    } hover:text-black transition-all duration-200 flex items-center focus:outline-none group py-2`}
                    onClick={() => toggleDropdown("categories")}
                    aria-expanded={activeDropdown === "categories"}
                  >
                    Categories
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === "categories" ? "rotate-180" : ""
                      } group-hover:rotate-180`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 top-full mt-0.5 w-64 bg-white shadow-xl rounded-lg py-2 border border-gray-100 z-50 transition-all duration-300 ease-in-out transform origin-top ${
                      activeDropdown === "categories"
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {categories.map((category) => (
                      <div key={category.id}>
                        <Link
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2.5 hover:bg-gray-50 hover:text-black transition-all duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {category.name}
                        </Link>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <Link
                        href="/categories"
                        className="block px-4 py-2.5 text-black font-medium hover:bg-gray-50 transition-all duration-200"
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
                    className="font-medium text-gray-800 hover:text-black transition-colors relative group py-2"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                ))}
              </nav>

              {/* Search, Cart, Account */}
              <div className="flex items-center space-x-2 md:space-x-5">
                {/* Search button/form */}
                <div className="relative">
                  {isSearchExpanded ? (
                    <>
                      <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setIsSearchExpanded(false)}
                      />
                      <div className="fixed inset-x-0 top-0 z-50 w-full animate-in slide-in-from-top duration-300 p-4">
                        <form
                          onSubmit={handleSearch}
                          className="relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] md:max-w-[600px] mx-auto"
                        >
                          <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-black">
                            <h3 className="text-lg font-semibold text-white">
                              Search Products
                            </h3>
                            <button
                              type="button"
                              className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                              onClick={() => setIsSearchExpanded(false)}
                              aria-label="Close search"
                            >
                              <X className="h-6 w-6 text-white" />
                            </button>
                          </div>

                          <div className="p-5">
                            <div className="relative">
                              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <Input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Search for products..."
                                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-black focus:ring-black rounded-lg text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoComplete="off"
                              />
                              {searchQuery && (
                                <button
                                  type="button"
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                  onClick={() => setSearchQuery("")}
                                  aria-label="Clear search"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Popular Searches
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  "Protein Powder",
                                  "Dumbbells",
                                  "Resistance Bands",
                                  "Pre-Workout",
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
                                    className="px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50 hover:border-black text-gray-700 rounded-lg transition-all duration-200"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                            <button
                              type="button"
                              onClick={() => setIsSearchExpanded(false)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-200 flex items-center gap-2 font-medium text-sm"
                            >
                              <Search className="h-4 w-4" />
                              Search
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-lg transition-all duration-200 focus:outline-none"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-lg transition-all duration-200"
                >
                  <Heart className="h-5 w-5" />
                </Link>

                {/* Cart */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="p-2 text-gray-600 hover:text-black hover:bg-black/5 rounded-lg transition-all duration-200 relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cart && cart.items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 animate-in zoom-in">
                        {cart.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Account dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("account")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <ClientOnly>
                    <button
                      className={`p-2 ${
                        activeDropdown === "account"
                          ? "text-black bg-black/5"
                          : "text-gray-600 hover:text-black hover:bg-black/5"
                      } rounded-lg transition-all duration-200 flex items-center focus:outline-none group`}
                      onClick={() => toggleDropdown("account")}
                      aria-expanded={activeDropdown === "account"}
                    >
                      {isAuthenticated ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <LogIn className="h-5 w-5" />
                      )}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === "account" ? "rotate-180" : ""
                        } group-hover:rotate-180`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 top-full mt-1 w-64 bg-white shadow-xl rounded-lg py-2 border border-gray-100 z-50 transition-all duration-300 ease-in-out transform origin-top ${
                        activeDropdown === "account"
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100 mb-2">
                            <p className="font-medium text-gray-800">
                              Hi, {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <Link
                            href="/account"
                            className="block px-4 py-2 hover:bg-gray-50 hover:text-black transition-all duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            className="block px-4 py-2 hover:bg-gray-50 hover:text-black transition-all duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="block px-4 py-2 hover:bg-gray-50 hover:text-black transition-all duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            My Wishlist
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setActiveDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200 mt-2 border-t border-gray-100"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-3">
                            <Link
                              href="/login"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Button className="w-full mb-2 hover:scale-[1.02] transition-transform duration-200 bg-black hover:bg-gray-900 rounded-lg">
                                Login
                              </Button>
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Button
                                variant="outline"
                                className="w-full hover:scale-[1.02] transition-transform duration-200 text-black border-black hover:bg-gray-50 rounded-lg"
                              >
                                Register
                              </Button>
                            </Link>
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
