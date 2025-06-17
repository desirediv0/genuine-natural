"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Truck,
  Users,
  Shield,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";

const BenefitsSec = () => {
  const benefits = [
    {
      title: "Premium Quality",
      description:
        "Lab-tested supplements made with high-quality ingredients for maximum effectiveness and safety.",
      icon: <Star className="w-8 h-8" />,
      color: "bg-black",
    },
    {
      title: "Fast Delivery",
      description:
        "Get your supplements delivered to your doorstep within 2-3 business days nationwide.",
      icon: <Truck className="w-8 h-8" />,
      color: "bg-gray-800",
    },
    {
      title: "Expert Support",
      description:
        "Our team of certified fitness experts is available 24/7 to help you choose the right supplements.",
      icon: <Users className="w-8 h-8" />,
      color: "bg-gray-700",
    },
    {
      title: "Secure Payments",
      description:
        "Shop with complete confidence using our 100% secure payment gateway with SSL encryption.",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-gray-600",
    },
  ];

  const stats = [
    {
      number: "100%",
      label: "Quality Tested",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "10K+",
      label: "Happy Customers",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Premium Products",
      icon: <Star className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Expert Support",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-black/5 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded-full px-6 py-3 mb-8"
          >
            <CheckCircle className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">
              Why Choose Our Supplements
            </span>
            <CheckCircle className="w-4 h-4 text-black" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-6 leading-tight"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 20px rgba(0,0,0,0.1)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              TRUSTED BY
            </motion.span>
            <span className="block text-black/40 -mt-2">CHAMPIONS</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-16 h-1 bg-black rounded-full" />
            <div className="w-4 h-4 bg-black rounded-full" />
            <div className="w-16 h-1 bg-black rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-black/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            We're committed to providing you with the highest quality fitness
            supplements
            <br />
            <span className="font-semibold text-black">
              backed by science and trusted by professionals.
            </span>
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="p-6 bg-white border-2 border-black rounded-2xl transition-all duration-300 hover:shadow-[8px_8px_0_0_#000] hover:-translate-x-1 hover:-translate-y-1 h-full">
                  <div className="flex flex-col space-y-4">
                    <motion.div
                      className={`${benefit.color} text-white p-4 rounded-xl w-fit group-hover:scale-110 transition-all duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-black group-hover:text-black transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-black/70 leading-relaxed text-sm group-hover:text-black/80 transition-colors">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Image and Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-black relative transform transition-transform duration-300 shadow-[8px_8px_0_0_#000]"
              whileHover={{ x: -4, y: -4, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-black/70 z-10" />
              <Image
                width={1000}
                height={1000}
                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1000"
                alt="Premium fitness supplements"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
                <motion.h3
                  className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  The Highest Quality for Your Fitness Journey
                </motion.h3>
                <motion.p
                  className="text-gray-200 mb-6 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  We carefully source and formulate each product to ensure you
                  get the best results for your fitness goals.
                </motion.p>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 inline-flex items-center group w-fit shadow-lg"
                  >
                    Learn More About Us
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <TrendingUp className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border-2 border-black rounded-2xl transition-all duration-300 hover:shadow-[6px_6px_0_0_#000] hover:-translate-x-1 hover:-translate-y-1 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className="text-black/60 group-hover:text-black transition-colors"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.5,
                  }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              <motion.h4
                className="text-4xl md:text-5xl font-black text-black mb-2 group-hover:scale-110 transition-transform origin-left"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(0,0,0,0)",
                    "0 0 10px rgba(0,0,0,0.1)",
                    "0 0 0px rgba(0,0,0,0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                }}
              >
                {stat.number}
              </motion.h4>
              <p className="text-black/60 uppercase tracking-wide text-sm font-bold group-hover:text-black transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSec;
