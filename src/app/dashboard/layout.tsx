"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in
    if (!accessToken) {
      // User is not logged in, redirect to login
      router.push("/login");
    }
  }, [accessToken, router]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="ml-64 flex w-full flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden bg-[#F8FAFC] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

