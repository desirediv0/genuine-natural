"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Trophy,
  ArrowRight,
  Flame,
  BoneIcon as Muscle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShowcaseBanner() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      id: 1,
      icon: Flame,
      title: "EXPLOSIVE ENERGY",
      subtitle: "Unleash Your Inner Beast",
      benefits: [
        "300% More Energy",
        "Zero Crash Formula",
        "Instant Activation",
        "All-Day Stamina",
      ],

      color: "from-white/20 to-white/5",
    },
    {
      id: 2,
      icon: Muscle,
      title: "RAPID MUSCLE GROWTH",
      subtitle: "Build Like Never Before",
      benefits: [
        "2x Faster Results",
        "Pure Lean Mass",
        "Enhanced Recovery",
        "Visible Changes",
      ],

      color: "from-white/15 to-white/5",
    },
    {
      id: 3,
      icon: Clock,
      title: "LIGHTNING RECOVERY",
      subtitle: "Train Harder, Recover Faster",
      benefits: [
        "50% Less Soreness",
        "Next-Day Ready",
        "Reduced Fatigue",
        "Peak Performance",
      ],

      color: "from-white/10 to-white/5",
    },
  ];

  return (
    <div className=" bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, -50, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-8"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">
              Transform Your Body & Mind
            </span>
            <Trophy className="w-4 h-4" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          >
            <motion.span
              className="block"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 30px rgba(255,255,255,0.3)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              UNLEASH
            </motion.span>
            <motion.span
              className="block text-white/40 -mt-4"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 1,
              }}
            >
              YOUR POTENTIAL
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Experience the ultimate transformation with our scientifically
            proven benefits.
            <br />
            <span className="text-white font-semibold">
              Real results. Real fast.
            </span>
          </motion.p>
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
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <div
                className={`relative bg-gradient-to-br ${benefit.color} backdrop-blur-sm border border-white/20 rounded-3xl p-8 h-full overflow-hidden`}
              >
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-2xl flex items-center justify-center"
                  animate={{
                    rotate: hoveredCard === benefit.id ? 360 : 0,
                    scale: hoveredCard === benefit.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <benefit.icon className="w-10 h-10" />
                </motion.div>

                {/* Content */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black mb-2">{benefit.title}</h3>
                  <p className="text-white/60 mb-6">{benefit.subtitle}</p>

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
                        <CheckCircle className="w-4 h-4 text-white/80" />
                        <span className="text-white/90 font-medium">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/5 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === benefit.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Floating Particles */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.3,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-black px-12 py-6 text-xl rounded-full shadow-2xl"
              >
                <Flame className="mr-3 w-6 h-6" />
                START YOUR TRANSFORMATION
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-white/60 text-lg"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Join 500,000+ athletes who transformed their lives
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
