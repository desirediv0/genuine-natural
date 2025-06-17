 "use client";

import { useEffect, useState, Suspense } from "react";
import { fetchApi } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import CategoryFilter from "./components/CategoryFilter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ArrowRight,
  Tag,
  Clock,
  User,
  Search,
  TrendingUp,
  Star,
} from "lucide-react";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg?height=240&width=400";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

function BlogContent() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true);
      try {
        let url = `/content/blog?page=${page}&limit=9`;
        if (categorySlug) {
          url += `&category=${categorySlug}`;
        }
        const response = await fetchApi(url);
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, [page, categorySlug]);

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full mb-6 shadow-lg"
        >
          <TrendingUp className="h-6 w-6 mr-3" />
          <span className="font-bold text-lg">Latest Articles</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
        >
          Our <span className="text-black">Blog</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Discover insights, tips, and industry knowledge to help you succeed
        </motion.p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <CategoryFilter />
      </motion.div>

      {/* Current category indicator */}
      <AnimatePresence>
        {categorySlug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full shadow-lg">
              <Tag className="h-5 w-5 mr-3" />
              <span className="font-semibold text-lg">
                Category:{" "}
                <span className="text-white font-bold">{categorySlug}</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <Skeleton className="w-full h-60" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : posts?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={getImageUrl(post.coverImage) || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="mr-4">{formatDate(post.createdAt)}</span>
                    {post.categories?.length > 0 && (
                      <>
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                          {post.categories[0].name}
                        </span>
                      </>
                    )}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold mb-3 transition-colors line-clamp-2 text-gray-800 hover:text-black">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="link"
                      className="px-0 text-black font-semibold group"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                >
                  Previous
                </Button>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={page === index + 1 ? "default" : "outline"}
                    onClick={() => setPage(index + 1)}
                    className={`px-4 py-2 rounded-xl ${
                      page === index + 1
                        ? "bg-black text-white"
                        : "border-2 border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white rounded-xl"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            No blog posts found
          </h2>
          {categorySlug ? (
            <p className="text-gray-600 mb-6">
              There are no posts in this category yet.
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Check back soon for new articles!
            </p>
          )}
          {categorySlug && (
            <Button
              onClick={() => (window.location.href = "/blog")}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold"
            >
              View All Posts
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12">
        {/* Wrap the content that uses useSearchParams in Suspense */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                >
                  <Skeleton className="w-full h-60" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-6" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <BlogContent />
        </Suspense>
      </main>
    </div>
  );
}
