"use client";

import Link from "next/link";
import {
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";


export function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="relative container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + About */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Being Genuine Nutrition Logo"
                width={250}
                height={250}
                className="mb-6 transform group-hover:scale-105 transition-transform duration-300 invert"
              />

            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Genuine Nutrition offers a curated selection of supplements and wellness products. We focus on quality, transparency and value.
            </p>

            <div className="flex items-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">About</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact & Newsletter</h4>

            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <MapPin className="text-white" size={18} />
              </div>
              <div className="text-gray-300 text-sm">89/2 Sector 39, Gurugram, Haryana</div>
            </div>

            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Mail className="text-white" size={18} />
              </div>
              <div className="text-gray-300 text-sm">connect.genuinenutrition@gmail.com</div>
            </div>


            <div className="flex items-center space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
          <div className="mb-4 md:mb-0">© 2025 <a href="https://beinggenuinenutrition.com" className="text-blue-400 hover:underline">Being Genuine Nutrition</a>. All Rights Reserved.</div>
          <div>Made with <span className="text-red-500">❤️</span> in India</div>
        </div>
      </div>
    </footer>
  );
}
