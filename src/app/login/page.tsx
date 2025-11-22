"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { accessToken, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    registrationCode: "",
    agreedToTerms: false,
  });

  useEffect(() => {
    // Check if user is already logged in
    if (accessToken) {
      // User is already logged in, redirect to dashboard
      router.push("/dashboard");
    }
  }, [accessToken, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("https://scapi.elitceler.com/api/v1/volunteers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationCode: formData.registrationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = "Login failed. Please check your registration code.";
        
        if (errorData) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join("\n");
          } else if (typeof errorData.message === "string") {
            errorMessage = errorData.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Store access token using zustand store
      if (result.accessToken) {
        setAuth(result.accessToken, result.registrationCode || formData.registrationCode);
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            {/* Registration Code Input */}
            <div>
              <label
                htmlFor="registrationCode"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Registration Code
              </label>
              <input
                type="text"
                id="registrationCode"
                value={formData.registrationCode}
                onChange={(e) =>
                  handleInputChange("registrationCode", e.target.value.toUpperCase())
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0F62FE] focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/20"
                placeholder="Enter your Registration Code (e.g., SCMUB7)"
                required
                disabled={isLoading}
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    handleInputChange("agreedToTerms", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#0F62FE] focus:ring-[#0F62FE]"
                  disabled={isLoading}
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg py-3 px-4 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)",
              }}
            >
              {isLoading ? "Logging in..." : "Login"}
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

