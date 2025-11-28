// Dashboard content commented out for now - showing "Coming Soon" instead
// import Image from "next/image";
// import { Edit, Wallet, Sprout, Users, Calendar } from "lucide-react";

export default function DashboardPage() {
  // Coming Soon - Dashboard content commented out for now
  /* 
  // Mock data for the table
  const donors = [
    {
      name: "Ramesh Kumar",
      contact: "9876277625",
      type: "One time",
      amount: "13,455",
      date: "02 August 2025",
      mode: "UPI",
    },
    {
      name: "Priya Sharma",
      contact: "9376447625",
      type: "Monthly",
      amount: "8755",
      date: "02 August 2025",
      mode: "Card",
    },
    {
      name: "John Mathew",
      contact: "9715636567",
      type: "Monthly",
      amount: "12755",
      date: "02 August 2025",
      mode: "Net banking",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Welcome John,</h1>

      <div className="relative rounded-2xl bg-[#EBF5FF] p-6 shadow-sm">
        <button className="absolute top-6 right-6 text-gray-500 hover:text-gray-700">
          <Edit className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
               <span className="text-2xl">JM</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-y-2 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Name-</span>
                      <span className="text-gray-700">John Jacobs</span>
                  </div>
              </div>
              
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Phone number-</span>
                  <span className="text-gray-700">+91 9063527878</span>
              </div>
              
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">State-</span>
                  <span className="text-gray-700">Delhi</span>
              </div>
              
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Volunteer ID-</span>
                  <span className="text-gray-700">SC124627</span>
              </div>

              <div className="flex items-center gap-2 col-span-1 md:col-span-2 lg:col-span-1">
                  <span className="font-semibold text-gray-900">E mail ID-</span>
                  <span className="text-gray-700">Johnjacob@yahoo.in</span>
              </div>

              <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Division-</span>
                  <span className="text-gray-700">EB</span>
              </div>
              
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Role-</span>
                  <span className="text-gray-700">Co-ordinator</span>
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
            <div className="text-xl font-bold text-gray-900">₹11,500</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#DCFCE7] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">New Donors</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#FEE2E2] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444] text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">48</div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-[#FEF3C7] p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">Upcoming events</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Donors</h2>
          <button className="rounded-lg bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            View all
          </button>
        </div>
        
        <div className="overflow-hidden rounded-xl bg-[#EFF6FF]">
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
            <tbody className="divide-y divide-gray-200 bg-white">
              {donors.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{donor.name}</td>
                  <td className="px-6 py-4">{donor.contact}</td>
                  <td className="px-6 py-4">{donor.type}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹{donor.amount}</td>
                  <td className="px-6 py-4">{donor.date}</td>
                  <td className="px-6 py-4">{donor.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  */

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">Coming Soon</h1>
        <p className="text-lg text-gray-600">We're working on something amazing. Stay tuned!</p>
      </div>
    </div>
  );
}

