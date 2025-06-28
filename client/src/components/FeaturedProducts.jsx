"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Eye, Heart, ShoppingCart } from "lucide-react";
import ProductQuickView from "./ProductQuickView";

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="relative h-64 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (!isLoading && !error && products.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Failed to load products</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Featured Products
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-1 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-12 h-1 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id || product.slug || Math.random().toString()}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden group relative transform hover:-translate-y-3 h-full flex flex-col border border-gray-100">
                    {/* Product Image */}
                    <div className="relative h-80 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden flex-shrink-0">
                      <Link href={`/products/${product.slug || ""}`}>
                        {product.image ? (
                          <Image
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name || "Product"}
                            fill
                            className="object-contain p-8 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <Image
                            src="/product-placeholder.jpg"
                            alt={product.name || "Product"}
                            fill
                            className="object-contain p-8 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        )}
                      </Link>

                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                      {/* Sale Badge */}
                      {product.hasSale && (
                        <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl transform -rotate-12 animate-pulse">
                          🔥 SALE
                        </span>
                      )}

                      {/* Action Icons */}
                      <div className="absolute top-6 right-6 flex flex-col space-y-3 translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-12 h-12 p-0 bg-white hover:bg-black hover:text-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-95 transform hover:scale-110 transition-all duration-300 border-2 border-gray-100"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-12 h-12 p-0 bg-white hover:bg-black hover:text-white rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-95 transform hover:scale-110 transition-all duration-300 border-2 border-gray-100"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                            setQuickViewOpen(true);
                          }}
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Bottom gradient for better text readability */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
                    </div>

                    {/* Product Info */}
                    <div className="p-8 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50/30">
                      {/* Product Name */}
                      <Link
                        href={`/products/${product.slug || ""}`}
                        className="block  flex-grow group-hover:transform group-hover:translate-y-1 transition-transform duration-500"
                      >
                        <h3 className="font-bold text-gray-900 mb-3 text-xl line-clamp-2 group-hover:text-black transition-colors leading-tight">
                          {product.name || "Product"}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center justify-center mb-4 p-2 bg-gray-50 rounded-xl">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 transition-all duration-300"
                              fill={
                                i < Math.round(Number(product.avgRating) || 0)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2 font-medium">
                          ({product.reviewCount || 0} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mb-6 text-center">
                        {product.hasSale ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-3">
                              <span className="font-bold text-3xl text-black">
                                ₹
                                {Number(
                                  product.basePrice || 0
                                ).toLocaleString()}
                              </span>
                              <span className="text-gray-400 line-through text-lg">
                                ₹
                                {Number(
                                  product.regularPrice || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-green-600 font-semibold text-sm">
                              Save ₹
                              {Number(
                                (product.regularPrice || 0) -
                                  (product.basePrice || 0)
                              ).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-3xl text-black">
                            ₹{Number(product.basePrice || 0).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Variants Info */}
                      {(product.flavors || 0) > 1 && (
                        <div className="mb-4 text-center">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            🎯 {product.flavors} variants available
                          </span>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <div className="mt-auto">
                        <Button
                          className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group-hover:animate-pulse"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                            setQuickViewOpen(true);
                          }}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-6 w-14 h-14 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110 rounded-2xl shadow-xl" />
            <CarouselNext className="hidden md:flex -right-6 w-14 h-14 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110 rounded-2xl shadow-xl" />
          </Carousel>
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-20">
          <Link href="/products">
            <Button
              variant="outline"
              size="lg"
              className="font-bold border-3 border-black text-black hover:bg-black hover:text-white px-16 py-8 rounded-2xl transition-all duration-700 transform hover:-translate-y-2 hover:shadow-2xl group bg-gradient-to-r from-white to-gray-50"
            >
              <span className="mr-3 transition-transform duration-500 group-hover:translate-x-1 text-lg">
                View All Products
              </span>
              <span className="relative top-[1px] transition-transform duration-500 group-hover:translate-x-3 text-xl">
                →
              </span>
            </Button>
          </Link>
        </div>

        {/* Quick View Dialog */}
        <ProductQuickView
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </div>
    </section>
  );
};

export default FeaturedProducts;
