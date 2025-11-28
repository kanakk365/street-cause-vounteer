"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DonationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the donations page
    router.push("/dashboard/donations");
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

