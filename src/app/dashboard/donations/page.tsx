"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiGet } from "@/lib/apiClient";
import toast from "react-hot-toast";

interface Donation {
  id: string;
  amount: number;
  status: string;
  subscriptionType: string;
  createdAt: string;
  donorName: string;
  donorEmail: string;
}

export default function DonationsPage() {
  const { accessToken } = useAuthStore();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDonations();
  }, [accessToken]);

  const fetchDonations = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiGet("https://scapi.elitceler.com/api/v1/volunteers/donations");

      if (!response.ok) {
        throw new Error("Failed to fetch donations");
      }

      const data = await response.json();
      setDonations(data || []);
      // Calculate total pages (assuming 10 items per page)
      setTotalPages(Math.ceil((data?.length || 0) / 10));
    } catch (error) {
      console.error("Error fetching donations:", error);
      // Don't show error toast if it's a 401 - user will be redirected
      if (error instanceof Error && !error.message.includes("Unauthorized")) {
        toast.error("Failed to load donations");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to match the display format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Format subscription type
  const formatSubscriptionType = (type: string) => {
    return type === "MONTHLY" ? "Monthly" : "One time";
  };

  // Filter donations based on search query
  const filteredDonations = donations.filter((donation) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      donation.donorName.toLowerCase().includes(query) ||
      donation.donorEmail.toLowerCase().includes(query) ||
      donation.id.toLowerCase().includes(query)
    );
  });

  // Pagination
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDonations.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading donations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600">All donations received using your SC ID</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="h-10 w-64 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
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
            {paginatedDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No donations found
                </td>
              </tr>
            ) : (
              paginatedDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{donation.donorName}</td>
                  <td className="px-6 py-4">{donation.donorEmail}</td>
                  <td className="px-6 py-4">{formatSubscriptionType(donation.subscriptionType)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{donation.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">{formatDate(donation.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        donation.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing {startIndex + 1} of {filteredDonations.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF5FF] text-[#0054BE] hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(filteredDonations.length / itemsPerPage)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF5FF] text-[#0054BE] hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

