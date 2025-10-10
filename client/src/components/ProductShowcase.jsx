"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductShowcase({ imageSrc = "/placeholder.jpg" }) {
    return (
        <motion.div className="grid md:grid-cols-2 gap-12 items-center mb-10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}>
            <div>
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <Zap className="w-4 h-4 mr-2" />
                    Featured Products
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-6 text-white">
                    Discover Our
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Best Sellers</span>
                </h2>
                <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-8 leading-relaxed">
                    From protein powders to essential vitamins, our carefully curated
                    collection of premium supplements is designed to support every
                    aspect of your health and fitness journey.
                </p>
                <div className="flex flex-row gap-2 md:gap-4">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold px-4 md:px-6">
                        <Link href="/products" className="flex items-center">
                            Shop All Products
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/30 text-black hover:bg-white/10 font-semibold px-4 md:px-6">
                        <Link href="/about" className="flex items-center">
                            <Target className="mr-2 w-5 h-5" />
                            Learn More
                        </Link>
                    </Button>
                </div>
            </div>

            <motion.div className="relative" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <div className="relative h-80 rounded overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                    <Image src={imageSrc} alt="Premium nutrition products showcase" fill className="object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm font-medium mb-1">Premium Collection</p>
                        <p className="text-xs opacity-80">Trusted by Athletes & Fitness Enthusiasts</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
