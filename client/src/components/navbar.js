"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRouter, usePathname } from "next/navigation"
import { fetchApi } from "@/lib/utils"
import { ClientOnly } from "./client-only"
import { toast, Toaster } from "sonner"
import Image from "next/image"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const searchInputRef = useRef(null)
  const navbarRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()

  // Enhanced scroll effect with hide/show functionality
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Update scrolled state
      setIsScrolled(currentScrollY > 20)

      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsNavVisible(false)
      } else {
        // Scrolling up
        setIsNavVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchExpanded(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchExpanded])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi("/public/categories")
        setCategories(response.data.categories || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchExpanded(false)
      setIsMenuOpen(false)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    window.location.href = "/"
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown)
    if (dropdown) {
      setActiveDropdown(dropdown)
    }
  }

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null)
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null)
    }
  }

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
  }

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
  }

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
  }

  const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    user,
    handleLogout,
  }) => {
    const mobileSearchInputRef = useRef(null)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

    // Sync local state with parent state
    useEffect(() => {
      setLocalSearchQuery(searchQuery)
    }, [searchQuery])

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (window.searchTimeout) {
          clearTimeout(window.searchTimeout)
        }
      }
    }, [])

    const handleMobileSearch = (e) => {
      e.preventDefault()
      if (localSearchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(localSearchQuery)}`)
        setIsMenuOpen(false)
        setSearchQuery("")
        setLocalSearchQuery("")
      }
    }

    const handleSearchInputChange = (e) => {
      e.stopPropagation()
      e.preventDefault()
      const value = e.target.value
      setLocalSearchQuery(value)
      // Only update parent state when user stops typing
      clearTimeout(window.searchTimeout)
      window.searchTimeout = setTimeout(() => {
        setSearchQuery(value)
      }, 300)
    }

    return (
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="lg:hidden fixed inset-0 z-[99999] bg-white overflow-y-auto"
            style={{ maxHeight: "100vh" }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-0 bg-black border-b border-gray-200 flex justify-between items-center px-6 py-5 z-[99999]"
              >
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                    <Image src="/logo.png" alt="being genuine nutraition" width={100} height={100} />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </motion.div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-gray-50">
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleMobileSearch}
                  className="relative"
                >
                  <div className="relative bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden hover:border-black transition-colors duration-300">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      ref={mobileSearchInputRef}
                      type="search"
                      placeholder="Search products..."
                      className="w-full pl-12 pr-16 py-4 text-base border-0 focus:ring-0 focus:outline-none bg-transparent"
                      value={localSearchQuery}
                      onChange={handleSearchInputChange}
                      autoComplete="off"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200 shadow-md"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.form>

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
                        className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 group flex items-center justify-between"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 rounded-xl bg-black flex items-center justify-center group-hover:bg-gray-800 transition-all"
                          >
                            <item.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <span className="font-semibold text-lg text-gray-900">{item.label}</span>
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
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
                  >
                    <h3 className="font-bold text-xl mb-5 text-gray-900 flex items-center">
                      <div className="w-1 h-6 bg-black rounded-full mr-3"></div>
                      Collections
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
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
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="font-medium text-gray-900">{category.name}</span>
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
                  className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
                >
                  <h3 className="font-bold text-xl mb-5 text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-black rounded-full mr-3"></div>
                    {isAuthenticated ? "My Account" : "Account"}
                  </h3>

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
                          <p className="font-bold text-gray-800">Hi, {user?.name || "User"}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
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
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-900">{item.label}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                          </Link>
                        </motion.div>
                      ))}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="w-full mt-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg font-semibold border border-red-200"
                      >
                        Logout
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600 mb-4">Join us for better shopping experience!</p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full py-3 bg-black text-white text-center rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg"
                        >
                          Login to Account
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full py-3 border-2 border-gray-200 text-black text-center rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
                        >
                          Create Account
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={isNavVisible ? "visible" : "hidden"}
        variants={navVariants}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled
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
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Logo */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Link href="/" className="flex items-center group">
                  <motion.div className="relative">
                    <Image
                      src="/logo.png"
                      alt="being genuine nutrition"
                      width={120}
                      height={50}
                      className="h-12 w-auto"
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
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
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
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
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
                                <span className="font-medium">{category.name}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                        <div className="px-6 py-3 border-t border-gray-100">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search */}
                <motion.div
                  className="relative hidden sm:block"
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
                          className="fixed inset-0 bg-black/50 z-40"
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
                            className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-2xl mx-auto"
                          >
                            <div className="flex items-center justify-between px-6 py-4 bg-black text-white">
                              <div>
                                <h3 className="text-xl font-bold flex items-center">
                                  <Search className="w-6 h-6 mr-2" />
                                  Search Products
                                </h3>
                                <p className="text-sm text-gray-300 mt-1">Find your perfect solution</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                                onClick={() => setIsSearchExpanded(false)}
                                aria-label="Close search"
                              >
                                <X className="h-6 w-6" />
                              </motion.button>
                            </div>

                            <div className="p-6">
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                                <Input
                                  ref={searchInputRef}
                                  type="search"
                                  placeholder="Search for products, services..."
                                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl text-lg font-medium"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
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
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold"
                              >
                                Cancel
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg group"
                              >
                                <Search className="h-5 w-5" />
                                Search Now
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                <motion.div
                  className="hidden sm:block"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/wishlist"
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200"
                    >
                      <Heart className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Cart */}
                <ClientOnly>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/cart"
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all duration-200 relative"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {cart && cart.items?.length > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 font-bold"
                          >
                            <motion.span
                              key={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                              initial={{ scale: 1.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                            </motion.span>
                          </motion.span>
                        )}
                      </Link>
                    </motion.div>
                  </motion.div>
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
                  <ClientOnly>
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
                      {isAuthenticated ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
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
                                    <p className="font-bold text-gray-800">Hi, {user?.name || "User"}</p>
                                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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
                                      <span className="font-medium">{item.label}</span>
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
                                    handleLogout()
                                    setActiveDropdown(null)
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
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/login" onClick={() => setActiveDropdown(null)}>
                                      <Button className="w-full py-3 bg-black hover:bg-gray-800 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                                        Login to Account
                                      </Button>
                                    </Link>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link href="/register" onClick={() => setActiveDropdown(null)}>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ClientOnly>
                </motion.div>
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
      </motion.header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20"></div>
    </>
  )
}
