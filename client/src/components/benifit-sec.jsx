"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Truck,
  Users,
  Award,
  Heart,
  Leaf,
  Clock,
  CheckCircle,
  Star,
  Phone,
  ArrowRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BenefitsSec = () => {
  const benefits = [
    {
      title: "Premium Quality",
      description:
        "Third-party tested supplements with ISO 22000 certification. Every product meets the highest purity and potency standards.",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-black",
      hoverColor: "hover:bg-black/80",
    },
    {
      title: "Fast & Free Delivery",
      description:
        "Free shipping on orders above ₹999. Get your wellness essentials delivered within 2-3 business days across India.",
      icon: <Truck className="w-8 h-8" />,
      color: "bg-black",
      hoverColor: "hover:bg-black/80",
    },
    {
      title: "Expert Guidance",
      description:
        "Our certified nutritionists provide personalized recommendations and 24/7 support for your wellness journey.",
      icon: <Users className="w-8 h-8" />,
      color: "bg-black",
      hoverColor: "hover:bg-black/80",
    },
    {
      title: "100% Secure",
      description:
        "Shop with confidence using our SSL-encrypted payment gateway. Your data and transactions are completely secure.",
      icon: <Award className="w-8 h-8" />,
      color: "bg-black",
      hoverColor: "hover:bg-black/80",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: <Heart className="w-6 h-6" />,
      color: "text-red-500",
    },
    {
      number: "100+",
      label: "Premium Products",
      icon: <Leaf className="w-6 h-6" />,
      color: "text-green-500",
    },
    {
      number: "99.5%",
      label: "Satisfaction Rate",
      icon: <Star className="w-6 h-6" />,
      color: "text-yellow-500",
    },
    {
      number: "8+",
      label: "Years Trusted",
      icon: <Clock className="w-6 h-6" />,
      color: "text-blue-500",
    },
  ];

  const certifications = [
    { name: "ISO 22000", desc: "Food Safety" },
    { name: "GMP", desc: "Good Manufacturing" },
    { name: "FSSAI", desc: "Licensed" },
    { name: "Lab Tested", desc: "Third Party" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-black/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-black/10 text-black border-black/50 hover:bg-black/20 transition-colors">
              <CheckCircle className="w-4 h-4 mr-2" />
              Why Choose Being Genuine Nutrition
              <Heart className="w-4 h-4 ml-2" />
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            <span className="text-gray-900">Trusted by Health</span>
            <br />
            <span className="text-transparent bg-clip-text bg-black">
              Enthusiasts Nationwide
            </span>
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
            className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            We&apos;re committed to providing you with the highest quality
            nutrition supplements
            <br />
            <span className="font-semibold text-gray-900">
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
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group-hover:border-gray-200">
                  <div className="flex flex-col space-y-4">
                    <motion.div
                      className={`${benefit.color} ${benefit.hoverColor} text-white p-4 rounded-xl w-fit transition-all duration-300`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {benefit.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors">
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
              className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <Image
                width={600}
                height={450}
                src="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1000"
                alt="Premium nutrition supplements and healthy lifestyle"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Science-Backed Nutrition for Your Wellness Journey
                </motion.h3>
                <motion.p
                  className="text-gray-200 mb-6 text-base leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Every product is carefully formulated with premium ingredients
                  and rigorously tested to ensure maximum effectiveness and
                  safety.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg"
                    asChild
                  >
                    <Link href="/about" className="flex items-center">
                      Learn More About Us
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
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
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`group-hover:scale-110 transition-transform`}
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
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform origin-left"
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
              <p className="text-gray-600 uppercase tracking-wide text-sm font-semibold group-hover:text-gray-800 transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quality Certifications
            </h3>
            <p className="text-gray-600">
              Trusted certifications that guarantee our commitment to quality
              and safety
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{cert.name}</h4>
                <p className="text-sm text-gray-600">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSec;
