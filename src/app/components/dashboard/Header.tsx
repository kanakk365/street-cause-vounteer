"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiGet } from "@/lib/apiClient";

interface VolunteerProfile {
  fullName: string;
  profileImageUrl: string | null;
}

export default function Header() {
  const { accessToken } = useAuthStore();
  const [volunteer, setVolunteer] = useState<VolunteerProfile | null>(null);

  // Fetch volunteer profile
  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      if (!accessToken) return;

      try {
        const response = await apiGet("https://scapi.elitceler.com/api/v1/volunteers/dashboard");
        if (response.ok) {
          const data = await response.json();
          setVolunteer(data?.volunteer || null);
        }
      } catch (error) {
        console.error("Error fetching volunteer profile:", error);
      }
    };

    fetchVolunteerProfile();
  }, [accessToken]);

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1);
  };

  return (
    <header 
      className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 shadow-sm text-white"
      style={{ background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)" }}
    >
       <div className="flex items-center gap-6">
           <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
               <ChevronLeft className="h-5 w-5" />
           </button>
           
           <div className="relative">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
               <input 
                 type="text" 
                 placeholder="Search" 
                 className="h-10 w-80 rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white outline-none placeholder-white/70 focus:bg-white/20 focus:ring-1 focus:ring-white/30"
               />
           </div>
       </div>
       
       <div className="flex items-center gap-6">
           <button className="relative text-white/90 hover:text-white transition-colors">
               <Bell className="h-6 w-6" />
               {/* Notification dot */}
               <span className="absolute top-0 right-0 block h-2.5 w-2.5 -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500 ring-2 ring-[#0054BE]"></span>
           </button>
           
           {/* Profile Circle */}
           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0054BE] font-bold cursor-pointer hover:bg-gray-100 transition-colors">
               {getInitials(volunteer?.fullName)}
           </div>
       </div>
    </header>
  );
}
