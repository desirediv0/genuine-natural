"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  Search,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

// Product Card Skeleton
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-64 w-full bg-gray-200"></div>
      <div className="p-6">
        <div className="flex justify-center mb-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-full bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-center">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(1000);

  const [filters, setFilters] = useState({
    search: searchQuery,
    category: categorySlug,
    flavor: "",
    weight: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
    order: "desc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        queryParams.append("page", pagination.page);
        queryParams.append("limit", pagination.limit);

        const validSortFields = ["createdAt", "updatedAt", "name", "featured"];
        let sortField = filters.sort;

        if (!validSortFields.includes(sortField)) {
          sortField = "createdAt";
          console.warn(
            `Invalid sort field: ${filters.sort}, using createdAt instead`
          );
        }

        queryParams.append("sort", sortField);
        queryParams.append("order", filters.order);

        if (filters.search) queryParams.append("search", filters.search);
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

        if (selectedFlavors.length > 0) {
          queryParams.append("flavor", selectedFlavors[0]);
        }

        if (selectedWeights.length > 0) {
          queryParams.append("weight", selectedWeights[0]);
        }

        const response = await fetchApi(
          `/public/products?${queryParams.toString()}`
        );

        let filteredProducts = response.data.products || [];

        if (
          selectedFlavors.length > 0 &&
          selectedWeights.length > 0 &&
          filteredProducts.length > 0
        ) {
          const productsWithExactMatch = [];

          for (const product of filteredProducts) {
            try {
              const detailResponse = await fetchApi(
                `/public/products/${product.slug}`
              );
              const detailedProduct = detailResponse.data.product;

              const hasMatchingVariant = detailedProduct.variants.some(
                (variant) =>
                  variant.flavor?.id === selectedFlavors[0] &&
                  variant.weight?.id === selectedWeights[0]
              );

              if (hasMatchingVariant) {
                productsWithExactMatch.push(product);
              }
            } catch (err) {
              console.error(
                `Error fetching details for product ${product.slug}:`,
                err
              );
            }
          }

          filteredProducts = productsWithExactMatch;
          setPagination({
            ...response.data.pagination,
            total: productsWithExactMatch.length,
          });
        } else {
          setPagination(response.data.pagination || {});
        }

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters,
    pagination.page,
    pagination.limit,
    selectedFlavors,
    selectedWeights,
  ]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesRes, flavorsRes, weightsRes] = await Promise.all([
          fetchApi("/public/categories"),
          fetchApi("/public/flavors"),
          fetchApi("/public/weights"),
        ]);

        setCategories(categoriesRes.data.categories || []);
        setFlavors(flavorsRes.data.flavors || []);
        setWeights(weightsRes.data.weights || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setPriceRange([
      filters.minPrice ? Number.parseInt(filters.minPrice) : 0,
      filters.maxPrice ? Number.parseInt(filters.maxPrice) : maxPossiblePrice,
    ]);
  }, [filters.minPrice, filters.maxPrice, maxPossiblePrice]);

  // Keep filters in sync with URL query params so navigation via router.push
  // (for example from the navbar search) updates the UI when already on /products
  useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev };
      let changed = false;

      if (next.search !== searchQuery) {
        next.search = searchQuery;
        changed = true;
      }

      if (next.category !== categorySlug) {
        next.category = categorySlug;
        changed = true;
      }

      if (changed) {
        // reset to first page on new filter/query
        setPagination((p) => ({ ...p, page: 1 }));
        return next;
      }

      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categorySlug]);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const response = await fetchApi("/public/products/max-price");
        const maxPrice = response.data.maxPrice || 1000;
        setMaxPossiblePrice(Math.ceil(maxPrice / 100) * 100);
      } catch (err) {
        console.error("Error fetching max price:", err);
        setMaxPossiblePrice(1000);
      }
    };

    fetchMaxPrice();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(`Error loading products. Please try again.`);
    }
  }, [error]);

  const handleFilterChange = (name, value) => {
    if ((name === "minPrice" || name === "maxPrice") && value !== "") {
      const numValue = Number.parseFloat(value);
      if (isNaN(numValue)) {
        return;
      }
      value = numValue.toString();
    }

    setFilters((prev) => ({ ...prev, [name]: value }));

    if (pagination.page !== 1) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }

    if (
      mobileFiltersOpen &&
      window.innerWidth < 768 &&
      name !== "minPrice" &&
      name !== "maxPrice" &&
      name !== "search"
    ) {
      setMobileFiltersOpen(false);
    }
  };

  const handleFlavorChange = (flavorId) => {
    const isAlreadySelected = selectedFlavors.includes(flavorId);

    if (isAlreadySelected) {
      const updatedFlavors = selectedFlavors.filter((id) => id !== flavorId);
      setSelectedFlavors(updatedFlavors);
      handleFilterChange(
        "flavor",
        updatedFlavors.length > 0 ? updatedFlavors[0] : ""
      );
    } else {
      setSelectedFlavors([flavorId]);
      handleFilterChange("flavor", flavorId);
    }
  };

  const handleWeightChange = (weightId) => {
    const isAlreadySelected = selectedWeights.includes(weightId);

    if (isAlreadySelected) {
      const updatedWeights = selectedWeights.filter((id) => id !== weightId);
      setSelectedWeights(updatedWeights);
      handleFilterChange(
        "weight",
        updatedWeights.length > 0 ? updatedWeights[0] : ""
      );
    } else {
      setSelectedWeights([weightId]);
      handleFilterChange("weight", weightId);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      flavor: "",
      weight: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
      order: "desc",
    });

    setSelectedFlavors([]);
    setSelectedWeights([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    switch (value) {
      case "newest":
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "desc");
        break;
      case "oldest":
        handleFilterChange("sort", "createdAt");
        handleFilterChange("order", "asc");
        break;
      case "name-asc":
        handleFilterChange("sort", "name");
        handleFilterChange("order", "asc");
        break;
      case "name-desc":
        handleFilterChange("sort", "name");
        handleFilterChange("order", "desc");
        break;
      default:
        break;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 md:py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        <div className="relative w-full h-[350px] mb-12 overflow-hidden">
          <Image
            src="/banner-background.jpg"
            alt="Premium Supplements"
            fill
            className="object-cover filter grayscale"
            priority
          />
          <div className="absolute inset-0 bg-black/70 text-center flex flex-col justify-center md:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              PREMIUM SUPPLEMENTS
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl text-center mx-auto">
              Fuel your performance with premium quality supplements designed
              for champions
            </p>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="md:hidden flex items-center justify-between mb-3 md:mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-black">Products</h1>
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 border-black text-black hover:bg-black hover:text-white"
          >
            <Filter className="h-5 w-5" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${mobileFiltersOpen
              ? "block fixed inset-0 z-50 bg-white p-4 overflow-auto"
              : "hidden"
              } lg:block lg:static lg:z-auto lg:bg-transparent lg:p-0`}
          >
            <div className="bg-white rounded-none shadow-sm  sticky top-20">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">FILTERS</h2>
                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-black hover:underline font-medium"
                  >
                    Clear all
                  </button>
                  <button
                    className="lg:hidden text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Search Filter */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold mb-3 text-black uppercase">
                  Search
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const searchInput = e.target.elements.search.value;
                    handleFilterChange("search", searchInput);
                  }}
                  className="relative"
                >
                  <Input
                    name="search"
                    placeholder="Search products..."
                    defaultValue={filters.search}
                    className="w-full pr-10 border-gray-300 focus:border-black focus:ring-black"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* Categories Filter */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-black uppercase">
                    Categories
                  </h3>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div
                    className={`cursor-pointer hover:text-black transition-colors ${filters.category === ""
                      ? "font-semibold text-black"
                      : "text-gray-600"
                      }`}
                    onClick={() => handleFilterChange("category", "")}
                  >
                    All Categories
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="ml-3">
                      <div
                        className={`cursor-pointer hover:text-black flex items-center transition-colors ${filters.category === category.slug
                          ? "font-semibold text-black"
                          : "text-gray-600"
                          }`}
                        onClick={() =>
                          handleFilterChange("category", category.slug)
                        }
                      >
                        <ChevronRight className="h-4 w-4 mr-1" />
                        {category.name}
                      </div>
                      {category.children && category.children.length > 0 && (
                        <div className="ml-6 mt-2 space-y-2">
                          {category.children.map((child) => (
                            <div
                              key={child.id}
                              className={`cursor-pointer hover:text-black text-sm transition-colors ${filters.category === child.slug
                                ? "font-semibold text-black"
                                : "text-gray-600"
                                }`}
                              onClick={() =>
                                handleFilterChange("category", child.slug)
                              }
                            >
                              {child.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavors Filter */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-black uppercase">
                    Flavor
                  </h3>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div
                    className={`cursor-pointer hover:text-black transition-colors ${selectedFlavors.length === 0
                      ? "font-semibold text-black"
                      : "text-gray-600"
                      }`}
                    onClick={() => {
                      setSelectedFlavors([]);
                      handleFilterChange("flavor", "");
                    }}
                  >
                    All Flavors
                  </div>

                  {flavors.map((flavor) => (
                    <div
                      key={flavor.id}
                      className={`cursor-pointer hover:text-black ml-3 flex items-center transition-colors ${selectedFlavors.includes(flavor.id)
                        ? "font-semibold text-black"
                        : "text-gray-600"
                        }`}
                      onClick={() => handleFlavorChange(flavor.id)}
                    >
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                        {selectedFlavors.includes(flavor.id) && (
                          <div className="w-2 h-2 rounded-sm bg-black"></div>
                        )}
                      </div>
                      {flavor.image && (
                        <div className="w-4 h-4 rounded-full overflow-hidden mr-2">
                          <Image
                            src={flavor.image || "/placeholder.jpg"}
                            alt={flavor.name}
                            width={16}
                            height={16}
                          />
                        </div>
                      )}
                      {flavor.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weights Filter */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-black uppercase">
                    Weight
                  </h3>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div
                    className={`cursor-pointer hover:text-black transition-colors ${selectedWeights.length === 0
                      ? "font-semibold text-black"
                      : "text-gray-600"
                      }`}
                    onClick={() => {
                      setSelectedWeights([]);
                      handleFilterChange("weight", "");
                    }}
                  >
                    All Weights
                  </div>

                  {weights.map((weight) => (
                    <div
                      key={weight.id}
                      className={`cursor-pointer hover:text-black ml-3 flex items-center transition-colors ${selectedWeights.includes(weight.id)
                        ? "font-semibold text-black"
                        : "text-gray-600"
                        }`}
                      onClick={() => handleWeightChange(weight.id)}
                    >
                      <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3 flex items-center justify-center">
                        {selectedWeights.includes(weight.id) && (
                          <div className="w-2 h-2 rounded-sm bg-black"></div>
                        )}
                      </div>
                      {weight.display}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Header with count and sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-3 md:p-6 ">
              <div className="text-black mb-4 sm:mb-0">
                {loading && !products.length ? (
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="text-lg">
                    Showing{" "}
                    <span className="font-bold text-black">
                      {products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-black">
                      {pagination.total || 0}
                    </span>{" "}
                    products
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {loading && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <div className="w-4 h-4 border-2 border-[#ce801f] border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                )}

                <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <span className="px-4 py-2 text-sm font-medium text-black">
                    SORT BY
                  </span>
                  <select
                    className="border-l border-gray-200 px-4 py-2 focus:outline-none bg-white text-black"
                    onChange={handleSortChange}
                    disabled={loading}
                    value={
                      filters.sort === "createdAt" && filters.order === "desc"
                        ? "newest"
                        : filters.sort === "createdAt" &&
                          filters.order === "asc"
                          ? "oldest"
                          : filters.sort === "name" && filters.order === "asc"
                            ? "name-asc"
                            : filters.sort === "name" && filters.order === "desc"
                              ? "name-desc"
                              : "newest"
                    }
                  >
                    <option value="newest">Featured</option>
                    <option value="name-asc">Alphabetically, A-Z</option>
                    <option value="name-desc">Alphabetically, Z-A</option>
                    <option value="oldest">Date, old to new</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.search ||
              filters.category ||
              selectedFlavors.length > 0 ||
              selectedWeights.length > 0 ||
              filters.minPrice ||
              filters.maxPrice) && (
                <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-semibold text-black">
                    Active Filters:
                  </span>

                  {filters.search && (
                    <div className="bg-black text-white text-sm px-3 py-1 rounded-full flex items-center">
                      <span>Search: {filters.search}</span>
                      <button
                        onClick={() => handleFilterChange("search", "")}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {filters.category && (
                    <div className="bg-black text-white text-sm px-3 py-1 rounded-full flex items-center">
                      <span>
                        Category:{" "}
                        {categories.find((c) => c.slug === filters.category)
                          ?.name || filters.category}
                      </span>
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {selectedFlavors.length > 0 && (
                    <div className="bg-black text-white text-sm px-3 py-1 rounded-full flex items-center">
                      <span>
                        Flavor:{" "}
                        {flavors.find((f) => f.id === selectedFlavors[0])?.name ||
                          selectedFlavors[0]}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedFlavors([]);
                          handleFilterChange("flavor", "");
                        }}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {selectedWeights.length > 0 && (
                    <div className="bg-black text-white text-sm px-3 py-1 rounded-full flex items-center">
                      <span>
                        Weight:{" "}
                        {weights.find((w) => w.id === selectedWeights[0])
                          ?.display || selectedWeights[0]}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedWeights([]);
                          handleFilterChange("weight", "");
                        }}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={clearFilters}
                    className="text-sm text-black underline font-medium ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[...Array(pagination.limit || 12)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-200">
                <div className="text-gray-400 mb-6">
                  <AlertCircle className="h-16 w-16 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4">
                  No products found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn&apos;t find any products matching your criteria. Try
                  adjusting your filters or search term.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination with updated styling */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center mt-12">
                <div className="flex items-center bg-white rounded-none shadow-sm  overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="rounded-none border-0 hover:bg-black hover:text-white px-4 py-3"
                  >
                    <ChevronUp className="h-4 w-4 rotate-90" />
                  </Button>

                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 &&
                        page <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-4 py-3 font-medium transition-colors ${pagination.page === page
                            ? "bg-black text-white"
                            : "hover:bg-gray-50 text-black"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    if (
                      (page === 2 && pagination.page > 3) ||
                      (page === pagination.pages - 1 &&
                        pagination.page < pagination.pages - 2)
                    ) {
                      return (
                        <span key={page} className="px-4 py-3 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="rounded-none border-0 hover:bg-black hover:text-white px-4 py-3"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#191918] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
