"use client"

import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/utils"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Shield,
  Award,
  Users,
  Heart,
  Leaf,
  Star,
  CheckCircle,
  TrendingUp,
  Clock,
  Target,
  Zap,
  ArrowRight,
  Quote,
  Play,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAboutContent() {
      setLoading(true)
      try {
        const response = await fetchApi("/content/about")
        setContent(response.data)
      } catch (error) {
        console.error("Failed to fetch about page content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10 mx-auto" />
          <Skeleton className="w-full h-[400px] mb-10 rounded-lg" />
        </div>
      </div>
    )
  }

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "100+", label: "Premium Products", icon: Award },
    { number: "8+", label: "Years of Excellence", icon: Clock },
    { number: "99.5%", label: "Customer Satisfaction", icon: Heart },
  ]

  const values = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Every product undergoes rigorous testing and quality control to ensure maximum potency and purity.",
      color: "bg-black",
    },
    {
      icon: Leaf,
      title: "Natural & Pure",
      description:
        "We source only the finest natural ingredients, free from harmful chemicals and artificial additives.",
      color: "bg-black",
    },
    {
      icon: Target,
      title: "Science-Backed",
      description: "Our formulations are based on the latest scientific research and clinical studies.",
      color: "bg-black",
    },
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "Your health and satisfaction are our top priorities. We're here to support your wellness journey.",
      color: "bg-black",
    },
  ]


  const testimonials = [
    {
      name: "Vikash Kumar",
      role: "Fitness Enthusiast",
      image: "/user.jpg",
      content:
        "Being Genuine Nutrition has transformed my fitness journey. The quality is unmatched and results speak for themselves.",
      rating: 5,
    },
    {
      name: "Sneha Reddy",
      role: "Professional Athlete",
      image: "/user.jpg",
      content:
        "As a professional athlete, I trust only BGN for my nutritional needs. Their products are pure and effective.",
      rating: 5,
    },
    {
      name: "Amit Gupta",
      role: "Gym Owner",
      image: "/user.jpg",
      content:
        "I recommend BGN to all my clients. The transparency and quality are exactly what the fitness community needs.",
      rating: 5,
    },
  ]

  const milestones = [
    {
      year: "2015",
      title: "Company Founded",
      description: "Started with a vision to provide genuine, high-quality nutrition supplements.",
    },
    {
      year: "2017",
      title: "First 1000 Customers",
      description: "Reached our first milestone of serving 1000 satisfied customers.",
    },
    {
      year: "2019",
      title: "ISO Certification",
      description: "Achieved ISO 22000 certification for food safety management.",
    },
    {
      year: "2021",
      title: "50K+ Community",
      description: "Built a strong community of 50,000+ health and fitness enthusiasts.",
    },
    {
      year: "2023",
      title: "International Expansion",
      description: "Expanded operations to serve customers across South Asia.",
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Customers
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Genuine Nutrition,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Genuine Results
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              We're not just another supplement brand. We're your partners in achieving optimal health through
              science-backed, premium quality nutrition products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-black text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Our Journey
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">From Passion to Purpose</h2>
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>
                    It all started in 2015 when our founder, Dr. Rahul Sharma, was struggling to find genuine,
                    high-quality supplements for his own fitness journey. Frustrated with products filled with fillers
                    and false promises, he decided to create something different.
                  </p>
                  <p>
                    Armed with a PhD in Biochemistry and years of research experience, Dr. Sharma began formulating
                    supplements that were not only effective but also transparent about their ingredients and
                    manufacturing processes.
                  </p>
                  <p>
                    Today, Being Genuine Nutrition stands as a testament to what happens when passion meets purpose.
                    We've helped over 50,000 individuals achieve their health and fitness goals with products they can
                    trust.
                  </p>
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
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/user.jpg"
                    alt="Our founder Dr. Rahul Sharma in the laboratory"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-sm font-medium mb-1">Dr. Rahul Sharma</p>
                    <p className="text-xs opacity-80">Founder & CEO</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-black">8+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
              </motion.div>
            </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">What Drives Us Forward</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our values aren't just words on a wall. They're the foundation of every decision we make and every
                product we create.
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
                      <h3 className="text-xl font-bold mb-4 text-black">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-black text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Milestones That Matter</h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300"></div>
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <Card className="shadow-lg border-0">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-black mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-3 text-black">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-6 bg-black text-white">
                <Quote className="w-4 h-4 mr-2" />
                Customer Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">What Our Customers Say</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full shadow-lg border-0">
                    <CardContent className="p-8">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-black">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.role}</div>
                        </div>
                      </div>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Being Genuine Nutrition for their health and fitness
              goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4">
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

      {/* Custom CMS Content */}
      {content && content.content && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
