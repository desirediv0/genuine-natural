import React from 'react'
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Link from 'next/link';


const Hero = () => {
  return (
    <div>
      {" "}
      <div className="relative w-full min-h-[calc(100vh-120px)]">
        {/* Hero Background with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10 h-screen" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-screen object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-screen lg:h-full  flex items-center">
          <AnimatePresence>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start space-y-6"
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <h1 className="text-4xl max-w-5xl  text-white mt-0  lg:mt-64  md:text-6xl Roboto  font-bold leading-tight">
                Transform Your Body With Premium Supplements
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Fuel your workout with our scientifically formulated
                supplements. Quality ingredients for maximum results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/product">
                  <motion.button
                    className="mt-3 group/btn inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-black px-6 py-2 rounded-lg text-base font-medium hover:bg-black hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Shop Now</span>
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </motion.button>
                </Link>

                {/* <Link
                  href="/product"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
                >
                  View Products
                </Link> */}
              </div>
            </motion.div>
            <div className="max-w-5xl space-y-6 text-white"></div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Hero