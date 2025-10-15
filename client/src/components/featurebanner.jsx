"use client";

import { motion } from "framer-motion";
import ShowcaseHero from "./ShowcaseHero";
import FeatureCards from "./FeatureCards";
import ProductShowcase from "./ProductShowcase";
import { Shield, Leaf, Heart } from "lucide-react";

const defaultBenefits = [
  {
    id: 1,
    icon: Shield,
    title: "Premium Quality",
    subtitle: "Third-Party Tested & Certified",
    benefits: ["ISO 22000 Certified", "Lab Tested Purity", "No Harmful Additives", "100% Natural"],
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    class: "col-span-1",
  },
  {
    id: 2,
    icon: Leaf,
    title: "Science-Backed",
    subtitle: "Research-Driven Formulations",
    benefits: ["Clinical Studies", "Expert Formulated", "Proven Results", "Safe & Effective"],
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-400",
    class: "col-span-1",
  },
  {
    id: 3,
    icon: Heart,
    title: "Customer-First",
    subtitle: "Your Wellness, Our Priority",
    benefits: ["24/7 Support", "Money-Back Guarantee", "Free Consultations", "Personalized Plans"],
    color: "from-red-500/20 to-red-600/10",
    iconColor: "text-red-400",
    class: "col-span-2 md:col-span-1",
  },
];

const defaultStats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "100+", label: "Premium Products" },
  { number: "99.5%", label: "Satisfaction Rate" },
  { number: "8+", label: "Years Trusted" },
];

export default function ShowcaseBanner({
  benefits = defaultBenefits,
  stats = defaultStats,
  showHero = true,
  showCards = true,
  showShowcase = true,
  // `only` can be 'hero' | 'cards' | 'showcase' to render a single part quickly
  only,
}) {
  // If `only` is provided, override the booleans
  if (only === "hero") {
    showHero = true;
    showCards = false;
    showShowcase = false;
  } else if (only === "cards") {
    showHero = false;
    showCards = true;
    showShowcase = false;
  } else if (only === "showcase") {
    showHero = false;
    showCards = false;
    showShowcase = true;
  }

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

      <div className="relative z-10 max-w-7xl mx-auto px-2 md:px-4 pt-10">
        {showHero && <ShowcaseHero stats={stats} />}
        {showCards && <FeatureCards benefits={benefits} />}
        {showShowcase && <ProductShowcase />}
      </div>
    </div>
  );
}

export { ShowcaseHero, FeatureCards, ProductShowcase };
