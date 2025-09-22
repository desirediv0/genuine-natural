"use client";

import { motion } from "framer-motion";
import { Award, Star, Users, Shield, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShowcaseHero({ stats = [] }) {
    return (
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
                <span className="text-sm font-medium">Trusted by 50,000+ Customers</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </motion.div>

            <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
                <motion.span className="block text-white">Premium Nutrition</motion.span>
                <motion.span
                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-purple-400"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
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
                Discover the power of science-backed nutrition supplements designed to
                support your health and wellness journey.
                <br />
                <span className="text-white text-lg font-semibold">Quality you can trust. Results you can see.</span>
            </motion.p>

            {/* Stats Row */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
            >
                {stats.map((stat, index) => (
                    <motion.div key={index} className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* CTA */}
            <motion.div className="text-center" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }}>
                <motion.div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold px-8 py-4 text-lg rounded-full shadow-2xl">
                            <Link href="/products" className="flex items-center">
                                <Heart className="mr-3 w-6 h-6" />
                                Start Your Wellness Journey
                                <ArrowRight className="ml-3 w-6 h-6" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>

                <motion.div className="flex items-center justify-center gap-6 text-gray-200" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
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
        </motion.div>
    );
}
