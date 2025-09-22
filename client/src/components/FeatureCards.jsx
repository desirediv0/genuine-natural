"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function FeatureCards({ benefits = [] }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <motion.div className="grid md:grid-cols-3 gap-8 mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
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
                    <div className={`relative bg-gradient-to-br ${benefit.color} backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-full overflow-hidden transition-all duration-300`}>
                        <motion.div className={`w-16 h-16 mx-auto mb-6 bg-white/10 rounded-xl flex items-center justify-center ${benefit.iconColor}`} animate={{ rotate: hoveredCard === benefit.id ? 5 : 0, scale: hoveredCard === benefit.id ? 1.1 : 1 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                            {/* Guard against missing icon component */}
                            {benefit.icon ? (
                                <benefit.icon className="w-8 h-8" />
                            ) : (
                                <svg className="w-6 h-6 text-white opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </motion.div>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                            <p className="text-gray-300 mb-6 text-sm">{benefit.subtitle}</p>

                            <div className="space-y-3">
                                {benefit.benefits.map((item, i) => (
                                    <motion.div key={i} className="flex items-center justify-center gap-3 text-sm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.1 }}>
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-gray-200 font-medium">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div className="absolute inset-0 bg-white/5 rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: hoveredCard === benefit.id ? 1 : 0 }} transition={{ duration: 0.3 }} />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
