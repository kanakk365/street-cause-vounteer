"use client";

import { useState, useEffect } from "react";
import { Edit, Wallet, Sprout, Users, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiGet } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Donor {
  donorName: string;
  contact: string;
  donationType: string;
  amount: number;
  dateOfDonation: string;
  paymentMode: string;
}

interface VolunteerProfile {
  id: string;
  registrationCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  division: string;
  role: string;
  profileImageUrl: string | null;
  state: string;
}

interface DashboardStats {
  totalDonations: number;
  newDonors: number;
  totalDonors: number;
  upcomingEvents: number;
}

interface DashboardResponse {
  volunteer: VolunteerProfile;
  stats: DashboardStats;
  donors: Donor[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchDashboardData();
    }
  }, [accessToken]);

  const fetchDashboardData = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await apiGet("https://scapi.elitceler.com/api/v1/volunteers/dashboard");
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error instanceof Error && !error.message.includes("Unauthorized")) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get recent donors for the table (limit to 5)
  const recentDonors = dashboardData?.donors
    ?.sort((a, b) => new Date(b.dateOfDonation).getTime() - new Date(a.dateOfDonation).getTime())
    .slice(0, 5) || [];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get volunteer data
  const volunteer = dashboardData?.volunteer;
  const stats = dashboardData?.stats;
  const volunteerName = volunteer?.fullName || "Volunteer";
  const firstName = volunteerName.split(" ")[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Welcome {firstName},</h1>

      <div className="relative rounded-2xl bg-[#EBF5FF] p-6 shadow-sm">
        <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-700">
          <Edit className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
            {volunteer?.profileImageUrl ? (
              <img
                src={volunteer.profileImageUrl}
                alt={volunteerName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                <span className="text-2xl">{getInitials(volunteerName)}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-y-2 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Name-</span>
                  <span className="text-gray-700">{volunteer?.fullName || "N/A"}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Phone number-</span>
                <span className="text-gray-700">{volunteer?.phoneNumber || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">State-</span>
                <span className="text-gray-700">{volunteer?.state || volunteer?.city || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Volunteer ID-</span>
                <span className="text-gray-700">{volunteer?.registrationCode || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 col-span-1 md:col-span-2 lg:col-span-1">
                <span className="font-semibold text-gray-900">E mail ID-</span>
                <span className="text-gray-700">{volunteer?.email || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Division-</span>
                <span className="text-gray-700">{volunteer?.division || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Role-</span>
                <span className="text-gray-700">{volunteer?.role || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl bg-[#F3E8FF] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A855F7] text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">₹{stats?.totalDonations.toLocaleString("en-IN") || 0}</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#DCFCE7] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{stats?.newDonors || 0}</div>
            <div className="text-sm text-gray-600">New Donors</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#FEE2E2] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444] text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{stats?.totalDonors || 0}</div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#FEF3C7] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{stats?.upcomingEvents || 0}</div>
            <div className="text-sm text-gray-600">Upcoming events</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
          <button
            onClick={() => router.push("/dashboard/donations")}
            className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View all
          </button>
        </div>
        
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#EBF5FF] text-gray-900">
              <tr>
                <th className="px-6 py-4 font-medium">Donor Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Donation Type</th>
                <th className="px-6 py-4 font-medium">Amount (₹)</th>
                <th className="px-6 py-4 font-medium">Date of Donation</th>
                <th className="px-6 py-4 font-medium">Payment mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentDonors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No donations yet
                  </td>
                </tr>
              ) : (
                recentDonors.map((donor, index) => (
                  <tr key={`${donor.donorName}-${donor.dateOfDonation}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{donor.donorName}</td>
                    <td className="px-6 py-4">{donor.contact}</td>
                    <td className="px-6 py-4">{donor.donationType}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{donor.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">{formatDate(donor.dateOfDonation)}</td>
                    <td className="px-6 py-4">{donor.paymentMode}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
