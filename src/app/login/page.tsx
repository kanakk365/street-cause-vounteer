"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    volunteerIdOrEmail: "",
    password: "",
    agreedToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", formData);
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Section - 35% width with image */}
      <div className="relative hidden w-[35%] lg:block">
        <Image
          src="/login.png"
          alt="Volunteers"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Section - 65% width with login form */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-8 py-12 lg:w-[65%]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Street Cause Logo"
              width={150}
              height={80}
              className="h-auto w-auto"
            />
          </div>

          {/* Welcome Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Welcome Back, Volunteer
            </h1>
            <p className="text-gray-600">
              Login to manage your activities and donations.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Volunteer ID / Email Input */}
            <div>
              <label
                htmlFor="volunteerIdOrEmail"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Volunteer ID / Email
              </label>
              <input
                type="text"
                id="volunteerIdOrEmail"
                value={formData.volunteerIdOrEmail}
                onChange={(e) =>
                  handleInputChange("volunteerIdOrEmail", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0F62FE] focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20"
                placeholder="Enter your Volunteer ID or Email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#0F62FE] focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    handleInputChange("agreedToTerms", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#0F62FE] focus:ring-[#0F62FE]"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I have read and agree to the{" "}
                  <a
                    href="#"
                    className="text-[#0F62FE] hover:underline"
                  >
                    Terms & Conditions
                  </a>
                  .
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm text-[#0F62FE] hover:underline"
              >
                Forgot password
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-lg py-3 px-4 font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)",
              }}
            >
              Login
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#0F62FE] hover:underline"
              >
                Register as Volunteer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

