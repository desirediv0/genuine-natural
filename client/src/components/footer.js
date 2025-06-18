"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
  Truck,
  Shield,
  Award,
  Heart,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing email:", email);
      setSubscribed(true);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 to-gray-400"></div>
      </div>

      <div className="relative container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Desire Div */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="relative group">
                <Image
                  src="/white-logo.png"
                  alt="Desire Div Logo"
                  width={140}
                  height={60}
                  className="mb-6 transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                Desire Div is a leading Website Designing Company offering best
                quality web design, development, and digital marketing services
                to help your business grow online.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <Shield className="w-6 h-6 text-white mb-2" />
                  <span className="text-xs font-semibold text-gray-300">
                    SSL Secured
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <Award className="w-6 h-6 text-white mb-2" />
                  <span className="text-xs font-semibold text-gray-300">
                    Trusted Brand
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <Truck className="w-6 h-6 text-white mb-2" />
                  <span className="text-xs font-semibold text-gray-300">
                    Fast Delivery
                  </span>
                </div>
              </div>

              {/* Social media links */}
              <div className="pt-4">
                <h4 className="font-bold text-lg mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  Follow Us
                </h4>
                <div className="flex space-x-3">
                  {[
                    {
                      icon: <Instagram size={18} />,
                      href: "#",
                      color: "bg-pink-600 hover:bg-pink-700",
                    },
                    {
                      icon: <Facebook size={18} />,
                      href: "#",
                      color: "bg-blue-600 hover:bg-blue-700",
                    },
                    {
                      icon: <Twitter size={18} />,
                      href: "#",
                      color: "bg-cyan-500 hover:bg-cyan-600",
                    },
                    {
                      icon: <Youtube size={18} />,
                      href: "#",
                      color: "bg-red-600 hover:bg-red-700",
                    },
                  ].map((social, idx) => (
                    <Link
                      key={idx}
                      href={social.href}
                      className={`w-12 h-12 ${social.color} hover:scale-110 flex items-center justify-center rounded-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl group`}
                    >
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {social.icon}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="mb-8">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center">
                <div className="w-1 h-6 bg-white rounded-full mr-3"></div>
                Company
              </h3>
              <div className="w-16 h-1 bg-white rounded-full"></div>
            </div>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "/careers" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Testimonials", href: "/testimonials" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center group p-2 hover:bg-white/5 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="mb-8">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center">
                <div className="w-1 h-6 bg-white rounded-full mr-3"></div>
                Support
              </h3>
              <div className="w-16 h-1 bg-white rounded-full"></div>
            </div>
            <ul className="space-y-4">
              {[
                { label: "Help Center", href: "/help" },
                { label: "FAQs", href: "/faqs" },
                { label: "Contact Support", href: "/support" },
                { label: "Live Chat", href: "/chat" },
                { label: "Documentation", href: "/docs" },
                { label: "API", href: "/api" },
                { label: "Status", href: "/status" },
                { label: "Community", href: "/community" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-all duration-300 text-sm flex items-center group p-2 hover:bg-white/5 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-all">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us & Newsletter */}
          <div>
            <div className="mb-8">
              <h3 className="text-white font-bold text-xl mb-2 flex items-center">
                <div className="w-1 h-6 bg-white rounded-full mr-3"></div>
                Contact Us
              </h3>
              <div className="w-16 h-1 bg-white rounded-full"></div>
            </div>

            <div className="space-y-6 text-sm">
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all flex-shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  T-16, Pocket-5, Plot no-6, Malik Builcon, Commercial Plaza
                  Dwarka Sector-12, New Delhi, 110075
                </span>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all flex-shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  hello@desirediv.com
                </span>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all flex-shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  +91 9871228880
                </span>
              </div>

              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all flex-shrink-0">
                  <Clock size={18} className="text-white" />
                </div>
                <div className="text-gray-300 group-hover:text-white transition-colors">
                  <div className="font-semibold">Business Hours:</div>
                  <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-white/10 bg-black">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Heart className="w-4 h-4 text-black" />
              </div>
              <div className="text-gray-400 text-sm">
                © 2024{" "}
                <a
                  href="https://desirediv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400"
                >
                  Desire Div
                </a>
                . All Rights Reserved | Made with ❤️ in India
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-white" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Award className="w-4 h-4 text-white" />
                <span>Trusted Brand</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Truck className="w-4 h-4 text-white" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
