"use client";

import { where } from "@/assets";
import { motion } from "framer-motion";
import { Award, Star, Users, Shield } from "lucide-react";
import Image from "next/image";

export default function ShowcaseHero() {
    return (
        <motion.section
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div>
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-4 md:mb-8"
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
                        className="text-lg md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Discover the power of science-backed nutrition supplements designed to
                        support your health and wellness journey.
                        <br />
                        <span className="text-white text-sm md:text-lg font-semibold">Quality you can trust. Results you can see.</span>
                    </motion.p>

                    <motion.div className="mt-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}>
                        <div className="flex flex-wrap items-center gap-6 text-gray-200">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">50,000+ Satisfied Customers</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm">100% Money-Back Guarantee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Image */}
                <div className="w-full">
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="relative w-full aspect-[16/12] rounded overflow-hidden shadow-xl">
                        <Image src={where} alt="Showcase" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
