import { Dumbbell, Zap, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShowcaseBanner() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rotate-45" />
          <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rotate-12" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/20 rotate-45" />
        </div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Dumbbell className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wider uppercase">
                    Premium Supplements
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Fuel Your
                  <span className="block text-white/80">Fitness Journey</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                  Premium quality supplements designed to maximize your
                  performance, accelerate recovery, and help you achieve your
                  fitness goals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">50K+</div>
                  <div className="text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">100%</div>
                  <div className="text-sm text-gray-400">Natural</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Main Product */}
                <div className="col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-white text-white"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">Best Seller</span>
                  </div>
                  <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <Dumbbell className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium Whey Protein</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    25g protein per serving
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">$49.99</span>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Secondary Products */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="w-full h-20 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">Pre-Workout</h4>
                  <p className="text-xs text-gray-400 mb-2">Energy Boost</p>
                  <span className="text-lg font-bold">$34.99</span>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="w-full h-20 bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">BCAA</h4>
                  <p className="text-xs text-gray-400 mb-2">Recovery</p>
                  <span className="text-lg font-bold">$29.99</span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full opacity-20" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Dumbbell className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Premium Quality</h3>
              <p className="text-gray-400">
                Lab-tested supplements with the highest quality ingredients for
                optimal results.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Fast Results</h3>
              <p className="text-gray-400">
                Scientifically formulated to deliver noticeable results in
                weeks, not months.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">Proven Success</h3>
              <p className="text-gray-400">
                Trusted by athletes and fitness enthusiasts worldwide for peak
                performance.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-lg text-gray-300">
              Join thousands of satisfied customers who have achieved their
              fitness goals with our premium supplements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
              >
                Start Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                View All Products
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
