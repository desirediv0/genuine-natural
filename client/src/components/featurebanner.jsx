"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield,
  ArrowRight,
  Leaf,
  Heart,
  Award,
  CheckCircle,
  Star,
  Users,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export default function ShowcaseBanner() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      id: 1,
      icon: Shield,
      title: "Premium Quality",
      subtitle: "Third-Party Tested & Certified",
      benefits: [
        "ISO 22000 Certified",
        "Lab Tested Purity",
        "No Harmful Additives",
        "100% Natural",
      ],
      color: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
    },
    {
      id: 2,
      icon: Leaf,
      title: "Science-Backed",
      subtitle: "Research-Driven Formulations",
      benefits: [
        "Clinical Studies",
        "Expert Formulated",
        "Proven Results",
        "Safe & Effective",
      ],
      color: "from-green-500/20 to-green-600/10",
      iconColor: "text-green-400",
    },
    {
      id: 3,
      icon: Heart,
      title: "Customer-First",
      subtitle: "Your Wellness, Our Priority",
      benefits: [
        "24/7 Support",
        "Money-Back Guarantee",
        "Free Consultations",
        "Personalized Plans",
      ],
      color: "from-red-500/20 to-red-600/10",
      iconColor: "text-red-400",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Premium Products" },
    { number: "99.5%", label: "Satisfaction Rate" },
    { number: "8+", label: "Years Trusted" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80, -20],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">
              Trusted by 50,000+ Customers
            </span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          >
            <motion.span className="block text-white">
              Premium Nutrition
            </motion.span>
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-purple-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              Genuine Results
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Discover the power of science-backed nutrition supplements designed
            to support your health and wellness journey.
            <br />
            <span className="text-white text-lg font-semibold">
              Quality you can trust. Results you can see.
            </span>
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 + index * 0.2 }}
              onHoverStart={() => setHoveredCard(benefit.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div
                className={`relative bg-gradient-to-br ${benefit.color} backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-full overflow-hidden transition-all duration-300`}
              >
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 bg-white/10 rounded-xl flex items-center justify-center ${benefit.iconColor}`}
                  animate={{
                    rotate: hoveredCard === benefit.id ? 5 : 0,
                    scale: hoveredCard === benefit.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <benefit.icon className="w-8 h-8" />
                </motion.div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 mb-6 text-sm">
                    {benefit.subtitle}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    {benefit.benefits.map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-center gap-3 text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-200 font-medium">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/5 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === benefit.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Product Showcase */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div>
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Featured Products
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Discover Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                Best Sellers
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              From protein powders to essential vitamins, our carefully curated
              collection of premium supplements is designed to support every
              aspect of your health and fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold"
              >
                <Link href="/products" className="flex items-center">
                  Shop All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-black hover:bg-white/10 font-semibold"
              >
                <Link href="/about" className="flex items-center">
                  <Target className="mr-2 w-5 h-5" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
              <Image
                src="/placeholder.jpg"
                alt="Premium nutrition products showcase"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium mb-1">Premium Collection</p>
                <p className="text-xs opacity-80">
                  Trusted by Athletes & Fitness Enthusiasts
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold px-8 py-4 text-lg rounded-full shadow-2xl"
              >
                <Link href="/products" className="flex items-center">
                  <Heart className="mr-3 w-6 h-6" />
                  Start Your Wellness Journey
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-6 text-gray-400"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">50,000+ Satisfied Customers</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">100% Money-Back Guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
