import React from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessStepProps {
  onGoToDashboard?: () => void;
}

export default function SuccessStep({ onGoToDashboard }: SuccessStepProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-[#EBF4FF] p-12 text-center">
        {/* Checkmark Circle */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#297AE0]">
          <Check className="h-12 w-12 text-white" strokeWidth={3} />
        </div>

        {/* Title */}
        <h2 className="mb-4 text-xl font-medium text-gray-900">
          Your application has been submitted successfully.
        </h2>

        {/* Description */}
        <p className="mb-8 text-sm text-gray-500">
          Your request is pending approval. You will receive an email once approved.
        </p>

        {/* Dashboard Button */}
        <button
          onClick={handleDashboardClick}
          className="w-full max-w-[250px] rounded-md bg-[#297AE0] px-6 py-3 text-sm font-medium text-white hover:bg-[#1e6ad4] focus:outline-none focus:ring-2 focus:ring-[#297AE0] focus:ring-offset-2"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

