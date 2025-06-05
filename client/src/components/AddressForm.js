"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, XCircle, MapPin, User, Phone, Home } from "lucide-react";

export default function AddressForm({
  onSuccess,
  onCancel,
  existingAddress = null,
  isInline = false,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: existingAddress?.name || "",
    street: existingAddress?.street || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    postalCode: existingAddress?.postalCode || "",
    country: existingAddress?.country || "India",
    phone: existingAddress?.phone || "",
    isDefault: existingAddress?.isDefault || false,
  });
  const [errors, setErrors] = useState({});

  // Improved validation rules
  const validations = {
    name: (value) => {
      if (!value.trim()) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return "";
    },
    phone: (value) => {
      if (!value.trim()) return "Phone number is required";
      if (!/^[0-9]{10}$/.test(value))
        return "Enter valid 10-digit phone number";
      return "";
    },
    postalCode: (value) => {
      if (!value.trim()) return "Postal code is required";
      if (!/^[0-9]{6}$/.test(value)) return "Enter valid 6-digit postal code";
      return "";
    },
    street: (value) => (!value.trim() ? "Street address is required" : ""),
    city: (value) => (!value.trim() ? "City is required" : ""),
    state: (value) => (!value.trim() ? "State is required" : ""),
    country: (value) => (!value.trim() ? "Country is required" : ""),
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate field on change
    const validationError = validations[name]?.(newValue) || "";
    setErrors((prev) => ({
      ...prev,
      [name]: validationError,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validations).forEach((field) => {
      const error = validations[field](formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const endpoint = existingAddress
        ? `/users/addresses/${existingAddress.id}`
        : "/users/addresses";

      const method = existingAddress ? "PATCH" : "POST";

      const response = await fetchApi(endpoint, {
        method,
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.success) {
        throw new Error(
          response.message ||
            `Failed to ${existingAddress ? "update" : "add"} address`
        );
      }

      toast.success(
        `Address ${existingAddress ? "updated" : "added"} successfully`
      );
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "Failed to save address");
      setErrors((prev) => ({ ...prev, general: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isInline
          ? "bg-gray-50 border-2 border-gray-200 rounded-2xl p-8"
          : "bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      }
    >
      {isInline && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-black p-2 rounded-xl mr-3">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">New Address</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close form"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
      )}

      {errors.general && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start">
          <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Full Name - Full width */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Label
              htmlFor="name"
              className="flex items-center text-base font-medium text-gray-700 mb-2"
            >
              <User className="h-4 w-4 mr-2 text-gray-900" />
              Full Name*
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name}</p>
            )}
          </div>

          {/* Street Address - Full width */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Label
              htmlFor="street"
              className="flex items-center text-base font-medium text-gray-700 mb-2"
            >
              <Home className="h-4 w-4 mr-2 text-gray-900" />
              Street Address*
            </Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.street
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="House number, Street, Apartment, etc."
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-2">{errors.street}</p>
            )}
          </div>

          {/* City */}
          <div>
            <Label
              htmlFor="city"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              City*
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.city
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-2">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <Label
              htmlFor="state"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              State*
            </Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.state
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter state"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-2">{errors.state}</p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <Label
              htmlFor="postalCode"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Postal Code*
            </Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.postalCode
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter 6-digit postal code"
              maxLength={6}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-2">{errors.postalCode}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label
              htmlFor="phone"
              className="flex items-center text-base font-medium text-gray-700 mb-2"
            >
              <Phone className="h-4 w-4 mr-2 text-gray-900" />
              Phone Number*
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </div>

          {/* Country */}
          <div className="sm:col-span-2">
            <Label
              htmlFor="country"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Country*
            </Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`h-14 px-4 text-base border-2 rounded-xl transition-all focus:ring-0 ${
                errors.country
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black hover:border-gray-300"
              }`}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-2">{errors.country}</p>
            )}
          </div>

          {/* Default Address Checkbox - Full width */}
          <div className="lg:col-span-3">
            <div className="flex items-center space-x-3 bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black transition-colors"
              />
              <Label
                htmlFor="isDefault"
                className="text-base font-medium cursor-pointer text-gray-700 flex items-center"
              >
                <Home className="h-4 w-4 mr-2 text-gray-900" />
                Set as default delivery address
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={loading}
              className="px-8 py-3 h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="px-10 py-3 h-14 bg-black hover:bg-gray-900 text-white text-base font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {existingAddress ? "Updating..." : "Saving..."}
              </span>
            ) : (
              existingAddress ? "Update Address" : "Save Address"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
