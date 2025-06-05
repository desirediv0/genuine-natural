"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientOnly } from "@/components/client-only";
import { fetchApi, formatDate } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Bell,
  ShieldCheck,
  CreditCard,
  Gift,
  Package,
  Heart,
} from "lucide-react";

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profileImage: null,
      });
    }
  }, [user]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const response = await fetchApi("/users/addresses", {
          credentials: "include",
        });
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0],
      }));

      // Create preview URL
      const file = files[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(formData);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <ProtectedRoute>
      <ClientOnly>
        <motion.div
          className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar - Profile Summary */}
              <motion.div 
                className="lg:w-1/4 space-y-6"
                variants={itemVariants}
              >
                <div className="rounded-3xl p-8 text-center">
                  <div className="mx-auto w-28 h-28 bg-gray-800 rounded-full border-4 border-gray-700 flex items-center justify-center mb-4">
                    <User className="w-14 h-14 text-gray-300" />
                  </div>
                  <h2 className="text-xl text-black font-bold mb-2">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Member since {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                  </p>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
                  <div className="space-y-4">
                    <Link href="/account/orders" className="flex items-center text-gray-600 hover:text-gray-900">
                      <Package className="w-5 h-5 mr-3" />
                      <span>My Orders</span>
                    </Link>
                    <Link href="/account/addresses" className="flex items-center text-gray-600 hover:text-gray-900">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>Saved Addresses</span>
                    </Link>
                    <Link href="/account/change-password" className="flex items-center text-gray-600 hover:text-gray-900">
                      <ShieldCheck className="w-5 h-5 mr-3" />
                      <span>Security Settings</span>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Main Content Area */}
              <motion.div 
                className="lg:flex-1 space-y-6"
                variants={itemVariants}
              >
                {/* Notification */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center p-4 rounded-2xl border ${
                      message.type === "success"
                        ? "bg-green-50 text-green-900 border-green-200"
                        : "bg-red-50 text-red-900 border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    )}
                    <p>{message.text}</p>
                  </motion.div>
                )}

                {/* Profile Information */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  </div>
                  <div className="p-6">
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              className="h-12 rounded-xl border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-100">
                          <Button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setPreview(null);
                              setFormData({
                                name: user?.name || "",
                                phone: user?.phone || "",
                                profileImage: null,
                              });
                            }}
                            variant="outline"
                            className="w-full sm:w-auto hover:bg-red-500 h-12"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto h-12 bg-gray-900 hover:bg-gray-800 text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Full Name</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{user?.name || "Not provided"}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-2">
                            <Mail className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Email Address</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900 break-all">{user?.email || "Not provided"}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-2">
                            <Phone className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Phone Number</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{user?.phone || "Not provided"}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-500">Member Since</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                    <Package className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                    <Heart className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Wishlist</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                    <MapPin className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Addresses</p>
                    <p className="text-xl font-bold text-gray-900">{addresses.length}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                    <Gift className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="text-xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
