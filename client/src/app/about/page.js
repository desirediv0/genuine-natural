"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Heart,
  Star,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Quote,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "High-Quality Ingredients",
      description:
        "Sourced with care and tested for purity to ensure the best nutritional value for our customers.",
      color: "bg-black",
    },
    {
      icon: Target,
      title: "Scientific Formulations",
      description:
        "Developed in line with the latest nutritional research to provide effective, science-backed solutions.",
      color: "bg-black",
    },
    {
      icon: Heart,
      title: "Affordability",
      description:
        "Because health should never be out of reach. We make quality nutrition accessible to everyone.",
      color: "bg-black",
    },
    {
      icon: Users,
      title: "Community Impact",
      description:
        "Every purchase contributes to the Being Human Foundation's humanitarian initiatives for underprivileged communities.",
      color: "bg-black",
    },
  ];

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Customers
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Being Genuine Nutrition
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Where Health Meets Humanity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              More than just a brand, we are an initiative born from the heart
              of the Being Human Foundation, inspired by the values of
              compassion, care, and community upliftment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-black text-lg px-8 py-4"
              >
                Shop Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-black text-white">
                <Heart className="w-4 h-4 mr-2" />
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
                Being Genuine Nutrition – Nourishing Lives with Purpose
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  In today&apos;s fast-paced world, health is not a
                  luxury—it&apos;s a necessity. At Being Genuine Nutrition, we
                  believe that good nutrition is the foundation for a healthier,
                  happier life. More than just a brand, we are an initiative
                  born from the heart of the Being Human Foundation, inspired by
                  the values of compassion, care, and community upliftment.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    The Heart Behind the Brand
                  </h3>
                  <p>
                    The Being Human Foundation has always stood for kindness,
                    social responsibility, and giving back. With Being Genuine
                    Nutrition, we extend this mission into the realm of health
                    and wellness—because true care goes beyond moments of
                    charity; it lives in everyday choices that nurture body,
                    mind, and soul.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    Why Nutrition Matters
                  </h3>
                  <p>
                    Good nutrition is not about diets or restrictions—it&apos;s
                    about giving the body what it truly needs to thrive.
                    Unfortunately, in many communities, access to quality
                    nutritional products is limited. We aim to change that. Our
                    products are thoughtfully designed to meet the nutritional
                    needs of people from all walks of life, focusing on:
                  </p>
                  <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
                    <li>
                      <strong>High-Quality Ingredients</strong> – Sourced with
                      care and tested for purity.
                    </li>
                    <li>
                      <strong>Scientific Formulations</strong> – Developed in
                      line with the latest nutritional research.
                    </li>
                    <li>
                      <strong>Affordability</strong> – Because health should
                      never be out of reach.
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    Our Promise
                  </h3>
                  <p>
                    Every purchase you make from Being Genuine Nutrition
                    contributes to the Being Human Foundation&apos;s
                    humanitarian initiatives—spanning education, healthcare, and
                    skill development for underprivileged communities. With us,
                    you are not just investing in your own health, but also in a
                    larger mission to improve lives.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-black">
                    Fuel Your Body, Feed a Cause
                  </h3>
                  <p>
                    When you choose Being Genuine Nutrition, you&apos;re
                    choosing:
                  </p>
                  <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
                    <li>Wellness with integrity</li>
                    <li>Products that deliver results</li>
                    <li>A movement that uplifts society</li>
                  </ul>
                  <p className="mt-4 italic">
                    Because being genuine is not just a name—it&apos;s a promise
                    to be real, responsible, and rooted in humanity.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">ISO 22000 Certified</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Third-Party Tested</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">100% Natural</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-gray-100 text-black">
                <Target className="w-4 h-4 mr-2" />
                Our Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
                What Drives Us Forward
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our values aren&apos;t just words on a wall. They&apos;re the
                foundation of every decision we make and every product we
                create.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                      >
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-black">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We invite you to be a part of our journey. Let&apos;s create a
              healthier future together—one meal, one supplement, one act of
              kindness at a time.
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              <strong>
                Being Genuine Nutrition – Where health meets humanity.
              </strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
              >
                <Link href="/products" className="flex items-center">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-black text-lg px-8 py-4"
              >
                <Link href="/contact" className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
