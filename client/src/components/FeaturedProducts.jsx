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
import { Eye, ShoppingCart } from "lucide-react";
import ProductQuickView from "./ProductQuickView";

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="relative h-72 bg-gray-200"></div>
    <div className="p-5 space-y-4">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-7 bg-gray-200 rounded w-1/3"></div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
        {/* Products Carousel */}
        <div className="relative px-2 md:px-8">
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
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="bg-white rounded-md shadow-lg hover:shadow-lg transition-all duration-500 overflow-hidden group relative transform hover:-translate-y-2 h-full flex flex-col border border-gray-100/50">
                    {/* Product Image */}
                    <div className="relative h-72  overflow-hidden flex-shrink-0">
                      <Link href={`/products/${product.slug || ""}`}>
                        {product.image ? (
                          <Image
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name || "Product"}
                            fill
                            className="object-contain px-2 transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          />
                        ) : (
                          <Image
                            src="/product-placeholder.jpg"
                            alt={product.name || "Product"}
                            fill
                            className="object-contain p-6 transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                          />
                        )}
                      </Link>

                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Sale Badge */}
                      {product.hasSale && (
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 animate-pulse">
                          🔥 SALE
                        </span>
                      )}

                      {/* Action Icons - Only visible on large screens and on hover */}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 bg-white/90 hover:bg-black hover:text-white rounded-xl shadow-lg backdrop-blur-sm transform hover:scale-110 transition-all duration-300 border border-gray-200"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                            setQuickViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Bottom gradient for better text readability */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50/20">
                      {/* Product Name */}
                      <Link
                        href={`/products/${product.slug || ""}`}
                        className="block flex-grow mb-3"
                      >
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg line-clamp-2 group-hover:text-black transition-colors leading-snug">
                          {product.name || "Product"}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="mb-4 text-center">
                        {product.hasSale ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-bold text-xl md:text-2xl text-black">
                                ₹
                                {Number(
                                  product.basePrice || 0
                                ).toLocaleString()}
                              </span>
                              <span className="text-gray-400 line-through text-sm md:text-base">
                                ₹
                                {Number(
                                  product.regularPrice || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-green-600 font-medium text-xs">
                              Save ₹
                              {Number(
                                (product.regularPrice || 0) -
                                  (product.basePrice || 0)
                              ).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-xl md:text-2xl text-black">
                            ₹{Number(product.basePrice || 0).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Variants Info */}
                      {(product.flavors || 0) > 1 && (
                        <div className="mb-4 text-center">
                          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            🎯 {product.flavors} variants
                          </span>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <div className="mt-auto">
                        <Button
                          className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold py-2.5 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-400 transform hover:scale-[1.02] text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setQuickViewProduct(product);
                            setQuickViewOpen(true);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 w-12 h-12 lg:w-14 lg:h-14 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110 rounded-xl shadow-lg" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 w-12 h-12 lg:w-14 lg:h-14 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-110 rounded-xl shadow-lg" />
          </Carousel>
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-16">
          <Link href="/products">
            <Button
              variant="default"
              size="lg"
              className="mt-3 group/btn inline-flex items-center space-x-2 bg-white/90 border border-black  backdrop-blur-sm text-black px-6 py-2 rounded-lg text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
            >
              <span className="mr-3 transition-transform duration-500 group-hover:translate-x-1 text-base md:text-lg">
                View All Products
              </span>
              <span className="relative top-[1px] transition-transform duration-500 group-hover:translate-x-3 text-lg md:text-xl">
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
