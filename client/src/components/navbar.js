"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  LogIn,
  ShoppingBag,
  Star,
  Mail,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import { logo } from "@/assets";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const isMenuOpenRef = useRef(false);
  const pathname = usePathname();

  // Enhanced scroll effect with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state
      setIsScrolled(currentScrollY > 20);

      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // keep a ref updated for the click outside handler to check current menu state
  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen;
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If mobile menu is open, ignore outside clicks so the overlay can handle interactions
      if (isMenuOpenRef.current) return;

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // only disable scroll; avoid setting position fixed on mobile (keyboard issues)
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // encode spaces as '+' for form-style query strings
      const encodeQuery = (s) => encodeURIComponent(s).replace(/%20/g, "+");
      router.push(`/products?search=${encodeQuery(searchQuery)}`);
      setIsSearchExpanded(false);
      closeMenu();
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

  // helper to keep ref in sync immediately when opening/closing menu
  const openMenu = () => {
    isMenuOpenRef.current = true;
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    isMenuOpenRef.current = false;
    setIsMenuOpen(false);
  };

  // Animation variants
  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hidden: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const MobileMenu = ({
    isMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    user,
    handleLogout,
  }) => {
    const mobileSearchInputRef = useRef(null);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const searchTimeoutRef = useRef(null);

    // Sync local state with parent state
    useEffect(() => {
      setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    const handleMobileSearch = (e) => {
      e.preventDefault();
      if (localSearchQuery.trim()) {
        const encodeQuery = (s) => encodeURIComponent(s).replace(/%20/g, "+");
        router.push(`/products?search=${encodeQuery(localSearchQuery)}`);
        // use closeMenu helper so the isMenuOpenRef stays in sync immediately
        closeMenu();
        // keep parent search state intact or clear after navigation; do not trigger extra rerenders here
        setLocalSearchQuery("");
      }
    };

    const handleSearchInputChange = (e) => {
      const value = e.target.value;
      setLocalSearchQuery(value);
      // Only update parent state when user stops typing
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, 300);
    };

    return (
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="lg:hidden fixed inset-0 z-[99999] bg-white overflow-y-auto"
            style={{ maxHeight: "100vh", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex flex-col min-h-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-0 bg-black border-b border-gray-200 flex justify-between items-center px-6 py-5 z-[99999]"
              >
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={closeMenu}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3"
                  >
                    <Image
                      src="/logo.png"
                      alt="being genuine nutraition"
                      width={150}
                      height={150}
                      className="invert"
                    />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeMenu}
                  className="p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>

              <div className="flex-1 px-6 py-8 space-y-8 bg-gray-50 overflow-y-auto">


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  {[
                    {
                      href: "/products",
                      label: "Shop Now",
                      icon: Sparkles,
                    },
                    { href: "/blog", label: "Resources", icon: Star },
                    { href: "/about", label: "Our Story", icon: Heart },
                    { href: "/contact", label: "Get in Touch", icon: Mail },
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="bg-white transition-all duration-300 group flex items-center justify-between"
                        onClick={closeMenu}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center group-hover:bg-gray-800 transition-all"
                          >
                            <item.icon className="w-4 h-4 text-white" />
                          </motion.div>
                          <span className="font-semibold text-lg text-gray-900">
                            {item.label}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white"
                  >
                    <h3 className="font-bold text-xl mb-5 text-gray-900 flex items-center">
                      <div className="w-1 h-6 bg-black rounded-full mr-3"></div>
                      Collections
                    </h3>
                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                      {categories.slice(0, 6).map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                        >
                          <Link
                            href={`/category/${category.slug}`}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                            onClick={closeMenu}
                          >
                            <span className="font-medium text-gray-900">
                              {category.name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* User Authentication Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-200"
                >
                  <h3 className="font-bold text-xl mb-3 text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-black rounded-full mr-3"></div>
                    <ClientOnly fallback="Account">
                      {isAuthenticated ? "My Account" : "Account"}
                    </ClientOnly>
                  </h3>

                  <ClientOnly
                    fallback={
                      <div className="space-y-4">
                        <p className="text-gray-600 mb-4">
                          Join us for better shopping experience!
                        </p>
                        <div className="flex  items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}

                          >
                            <Link
                              href="/login"
                              onClick={closeMenu}
                              className=" w-full py-3 bg-black text-white text-center rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg"
                            >
                              Login to Account
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/register"
                              onClick={closeMenu}
                              className=" w-full py-3 border-2 border-gray-200 text-black text-center rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
                            >
                              Create Account
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    }
                  >
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-12 h-12 rounded-full bg-black flex items-center justify-center"
                          >
                            <User className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <p className="font-bold text-gray-800">
                              Hi, {user?.name || "User"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {[
                          {
                            href: "/account",
                            label: "Profile Settings",
                            icon: User,
                          },
                          {
                            href: "/account/orders",
                            label: "My Orders",
                            icon: ShoppingBag,
                          },
                          { href: "/wishlist", label: "Wishlist", icon: Heart },
                          {
                            href: "/cart",
                            label: "Shopping Cart",
                            icon: ShoppingCart,
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                              onClick={() => closeMenu()}
                            >
                              <div className="flex items-center space-x-3">
                                <item.icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  {item.label}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </Link>
                          </motion.div>
                        ))}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                          className="w-full mt-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg font-semibold border border-red-200"
                        >
                          Logout
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600 mb-4">
                          Join us for better shopping experience!
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/login"
                              onClick={closeMenu}
                              className="block w-full py-3 px-5 bg-black text-white text-center rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg"
                            >
                              Login to Account
                            </Link>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/register"
                              onClick={closeMenu}
                              className="block w-full py-3 px-5 border-2 border-gray-200 text-black text-center rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
                            >
                              Create Account
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </ClientOnly>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={isNavVisible ? "visible" : "hidden"}
        variants={navVariants}
        className={`md:fixed sticky top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200 w-[95%] mx-auto mt-4 rounded-2xl"
          : "bg-white shadow-lg border-b border-gray-100 w-full"
          }`}
        ref={navbarRef}
      >
        <Toaster position="top-center" />

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex justify-between items-center h-20">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none"
                  onClick={openMenu}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/" className="flex items-center group">
                  <motion.div className="relative">
                    <Image
                      src="/logo.png"
                      alt="Being Genuine Nutrition Logo"
                      width={200}
                      height={200}
                      className="h-10 w-auto "
                    />
                  </motion.div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {[
                  { href: "/products", label: "Shop Now" },
                  { href: "/blog", label: "Resources" },
                  { href: "/about", label: "Our Story" },
                  { href: "/contact", label: "Get in Touch" },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-2 font-semibold text-gray-700 hover:text-black transition-all duration-200 relative group rounded-lg"
                    >
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Categories dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("categories")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`px-4 py-2 font-semibold ${activeDropdown === "categories"
                      ? "text-black bg-gray-50"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                      } transition-all duration-200 flex items-center focus:outline-none rounded-lg relative group`}
                    onClick={() => toggleDropdown("categories")}
                    aria-expanded={activeDropdown === "categories"}
                  >
                    <span className="relative z-10">Categories</span>
                    <motion.div
                      animate={{
                        rotate: activeDropdown === "categories" ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {activeDropdown === "categories" && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute left-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl py-4 border border-gray-200 z-50"
                      >
                        <div className="px-6 py-3 border-b border-gray-100">
                          <h3 className="font-bold text-lg text-gray-800 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-black" />
                            Browse Collections
                          </h3>
                        </div>
                        <div className="py-2 max-h-80 overflow-y-auto">
                          {categories.map((category, index) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={`/category/${category.slug}`}
                                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <div className="px-6 py-3 border-t border-gray-100">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/categories"
                              className="flex items-center justify-center w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold group"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Explore All Collections
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </nav>

              {/* Right side - Search, Cart, Account */}
              <div className="flex items-center space-x-2 sm:space-x-4 z-50">
                {/* Search */}
                <motion.div
                  className="relative block pl-3 z-50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatePresence>
                    {isSearchExpanded ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/50 z-50"
                          onClick={() => setIsSearchExpanded(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="fixed inset-x-0 top-0 z-50 w-full p-4"
                        >
                          <form
                            onSubmit={handleSearch}
                            className="relative bg-white rounded-xl shadow-2xl border border-gray-800 overflow-hidden max-w-2xl mx-auto"
                          >
                            <div className="flex items-center justify-between px-6 py-4 bg-black text-white">
                              <div>
                                <h3 className="text-lg md:text-xl font-bold flex items-center">
                                  <Search className="md:w-6 md:h-6 h-4 w-4 mr-2" />
                                  Search Products
                                </h3>
                                <p className="text-xs md:text-sm text-gray-300 mt-1">
                                  Find your perfect solution
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                                onClick={() => setIsSearchExpanded(false)}
                                aria-label="Close search"
                              >
                                <X className="md:w-6 md:h-6 h-4 w-4" />
                              </motion.button>
                            </div>

                            <div className="md:p-6 p-3">
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 md:w-6 md:h-6 h-4 w-4 text-gray-400" />
                                <Input
                                  ref={searchInputRef}
                                  type="search"
                                  placeholder="Search for products, services..."
                                  className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-4 border-2 border-gray-200 focus:border-black focus:ring-0 rounded text-lg font-medium"
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  autoComplete="off"
                                />
                                {searchQuery && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                  >
                                    <X className="h-5 w-5" />
                                  </motion.button>
                                )}
                              </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setIsSearchExpanded(false)}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold text-xs md:text-sm"
                              >
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="px-4 md:px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg group"
                              >
                                <Search className="md:h-5 md:w-5 h-3 w-3" />
                                <span className="text-xs md:text-sm"> Search Now</span>
                                <ArrowRight className="md:h-5 md:w-5 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSearchExpanded(true)}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none"
                        aria-label="Search"
                      >
                        <Search className="h-5 w-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="hidden md:block p-2 text-gray-600 hover:text-primary transition-colors relative"
                >
                  <Heart className="h-5 w-5" />
                </Link>

                {/* Cart */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="p-2 text-gray-600 hover:text-primary transition-colors relative hidden md:block"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Account dropdown */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("account")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 ${activeDropdown === "account"
                      ? "text-black bg-gray-100"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                      } rounded-xl transition-all duration-200 flex items-center focus:outline-none`}
                    onClick={() => toggleDropdown("account")}
                    aria-expanded={activeDropdown === "account"}
                  >
                    <ClientOnly fallback={<LogIn className="h-5 w-5" />}>
                      {isAuthenticated ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <LogIn className="h-5 w-5" />
                      )}
                    </ClientOnly>
                    <motion.div
                      animate={{
                        rotate: activeDropdown === "account" ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {activeDropdown === "account" && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl py-4 border border-gray-200 z-50"
                      >
                        <ClientOnly
                          fallback={
                            <div className="px-6 py-4">
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          }
                        >
                          {isAuthenticated ? (
                            <>
                              <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                  <motion.div
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-12 h-12 rounded-full bg-black flex items-center justify-center"
                                  >
                                    <User className="h-6 w-6 text-white" />
                                  </motion.div>
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
                                {[
                                  { href: "/account", label: "My Account" },
                                  {
                                    href: "/account/orders",
                                    label: "My Orders",
                                  },
                                  { href: "/wishlist", label: "My Wishlist" },
                                ].map((item, index) => (
                                  <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    <Link
                                      href={item.href}
                                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-all duration-200 group"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
                                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="px-6 py-3 border-t border-gray-100">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    handleLogout();
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg font-semibold"
                                >
                                  Logout
                                </motion.button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="px-6 py-4">
                                <motion.h3
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="font-bold text-lg text-gray-800 mb-4"
                                >
                                  Welcome Back!
                                </motion.h3>
                                <div className="space-y-3">
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Link
                                      href="/login"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <Button className="w-full py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                        Login to Account
                                      </Button>
                                    </Link>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Link
                                      href="/register"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <Button
                                        variant="outline"
                                        className="w-full py-3 border-2 border-gray-200 text-black hover:bg-black hover:text-white rounded-lg font-semibold transition-all duration-200"
                                      >
                                        Create Account
                                      </Button>
                                    </Link>
                                  </motion.div>
                                </div>
                              </div>
                            </>
                          )}
                        </ClientOnly>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      </motion.header>

      {/* Mobile Menu (rendered outside the animated header so fixed positioning is viewport-scoped) */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isAuthenticated={isAuthenticated}
        user={user}
        cart={cart}
        handleLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-2 px-1 ${pathname === "/" ? "text-primary" : "text-gray-600"
              }`}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className={`flex flex-col items-center justify-center py-2 px-1 ${pathname.includes("/account") || pathname === "/login"
              ? "text-primary"
              : "text-gray-600"
              }`}
          >
            <ClientOnly fallback={<LogIn className="h-6 w-6" />}>
              {isAuthenticated ? (
                <User className="h-6 w-6" />
              ) : (
                <LogIn className="h-6 w-6" />
              )}
            </ClientOnly>
            <span className="text-xs mt-1">You</span>
          </Link>

          <Link
            href="/cart"
            className={`flex relative flex-col items-center justify-center py-2 px-1  w-full ${pathname === "/cart" ? "text-primary" : "text-gray-600"
              }`}
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
              <span className="text-xs mt-1">Cart</span>
            </div>
          </Link>

          <motion.a
            href="https://genuinenutrition.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center  px-1"
          >
            <Image
              src={logo}
              alt="Genuine Nutrition"
              width={150}
              height={150}
              className="h-[75px] w-[75px] object-contain"
            />
          </motion.a>
        </div>
      </div>
    </>
  );
}
