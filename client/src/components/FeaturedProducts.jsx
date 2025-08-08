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
import ProductCard from "./ProductCard";

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
                  <div className="transform hover:-translate-y-2 transition-all duration-500">
                    <ProductCard
                      product={product}
                      onQuickView={(product) => {
                        setQuickViewProduct(product);
                        setQuickViewOpen(true);
                      }}
                      className="h-full"
                      showVariants={true}
                    />
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
