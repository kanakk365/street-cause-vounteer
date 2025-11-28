"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Calendar, ChevronRight, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearAuth } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform" aria-label="Sidebar">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4 text-white" style={{ background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)" }}>
        {/* Logo */}
        <div className="  flex items-center gap-3 justify-center mb-5">
            <div className="relative w-48 h-14">
                {/* Using a placeholder or logo if available. The login page used /logo.png. We need a white version or invert it. */}
               <Image 
                 src="/sidebarlogo.png" 
                 alt="Street Cause" 
                 fill 
                 className="" 
               />
            </div>
        </div>
        
        {/* Navigation */}
        <ul className="space-y-2 font-medium flex-1">
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                pathname === "/dashboard" 
                  ? "bg-white/10 text-white" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/donations" 
              className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                pathname === "/dashboard/donations" || pathname === "/donation"
                  ? "bg-white/10 text-white" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span className="ml-3">Donations</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/events" 
              className={`flex items-center rounded-lg px-4 py-3 transition-colors ${
                pathname === "/dashboard/events" || pathname === "/event"
                  ? "bg-white/10 text-white" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="ml-3">Events</span>
            </Link>
          </li>
        </ul>

        {/* Bottom User Profile */}
        <div className="mt-auto mb-4 relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white/10 transition-colors cursor-pointer"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0054BE] font-bold text-lg">
                    J
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-xs opacity-80">Welcome</span>
                    <span className="text-sm font-bold">John</span>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-80 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
        </div>
      </div>
    </aside>
  );
}

