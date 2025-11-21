import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "../../store/onboardingStore";

// Define interfaces for the data props
interface PersonalInfoData {
  profileImage?: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  division: string;
  role: string;
}

interface GovtIdData {
  fileName?: string;
  fileType?: string;
}

interface SelfieData {
  image?: string | null;
}

interface AddressData {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ReviewSubmitStepProps {
  onBack: () => void;
  onSubmit: () => void;
  personalData: PersonalInfoData | null;
  govtIdData?: GovtIdData | null;
  selfieData?: SelfieData | null;
  addressData?: AddressData | null;
}

// Helper component for section header
const SectionHeader = ({
  title,
  sectionKey,
  isExpanded,
  onToggle,
}: {
  title: string;
  sectionKey: string;
  isExpanded: boolean;
  onToggle: (section: string) => void;
}) => (
  <button
    onClick={() => onToggle(sectionKey)}
    className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
  >
    <span className="text-lg font-medium text-gray-900">{title}</span>
    {isExpanded ? (
      <ChevronUp className="text-gray-500" size={20} />
    ) : (
      <ChevronDown className="text-gray-500" size={20} />
    )}
  </button>
);

export default function ReviewSubmitStep({
  onBack,
  onSubmit,
  personalData,
  govtIdData,
  selfieData,
  addressData,
}: ReviewSubmitStepProps) {
  const { personalInfo, govtIds, selfie, address, setCurrentStep } = useOnboardingStore();
  // Use store data if available, otherwise fall back to props
  const displayPersonalData = personalData || personalInfo;
  const displaySelfieData = selfieData || (selfie ? { image: selfie.image } : null);
  const displayAddressData = addressData || address;
  const displayGovtIdData = govtIdData || (govtIds.length > 0 ? {
    fileName: govtIds[0].fileName,
    fileType: govtIds[0].fileType,
  } : null);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal", "govtId", "selfie", "address"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full mx-auto max-w-5xl max-h-[80vh] my-auto  flex flex-col h-full ">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 5 of 5</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Review your details & <span className="text-[#0F62FE]">Submit</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Please review your details before submitting. Once submitted, you&apos;ll
          receive your SC Volunteer ID.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8 ">
        {/* Personal Information Section */}
        <div className="rounded-lg bg-[#EFF6FF] overflow-hidden">
          <SectionHeader 
            title="Personal Information" 
            sectionKey="personal" 
            isExpanded={expandedSections.has("personal")}
            onToggle={toggleSection}
          />
          {expandedSections.has("personal") && (
            <div className="px-6 pb-6">
              <div className="h-px w-full bg-gray-200 mb-6"></div>
              <div className="flex flex-col md:flex-row gap-6 relative">
                {/* Profile Image */}
                <div className="shrink-0">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 relative">
                    {displayPersonalData?.profileImage ? (
                      <Image
                        src={displayPersonalData.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grow grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Name- </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.fullName || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Phone number -{" "}
                    </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.phoneNumber || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">City - </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.city || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      E mail ID -{" "}
                    </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.email || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Division -{" "}
                    </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.division || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Role - </span>
                    <span className="text-[#0F62FE]">
                      {displayPersonalData?.role || "Not provided"}
                    </span>
                  </div>
                </div>

                {/* Edit Icon */}
                <button 
                  onClick={() => handleEdit(1)}
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-[#0F62FE] transition-colors"
                  title="Edit Personal Information"
                >
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Govt. ID Upload Section */}
        <div className="rounded-lg bg-[#EFF6FF] overflow-hidden">
          <SectionHeader 
            title="Govt. ID Upload" 
            sectionKey="govtId" 
            isExpanded={expandedSections.has("govtId")}
            onToggle={toggleSection}
          />
          {expandedSections.has("govtId") && (
            <div className="px-6 pb-6 relative">
              <div className="h-px w-full bg-gray-200 mb-4"></div>
              <div className="flex items-center gap-3 bg-[#D4E3FC] rounded-lg p-3 w-fit">
                {/* PDF Icon */}
                <div className="shrink-0 bg-red-500 rounded p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      fill="white"
                    />
                    <path d="M14 2V8H20" fill="white" />
                  </svg>
                </div>
                <span className="text-sm text-[#0F62FE] font-medium">
                  {displayGovtIdData?.fileName || "Aadhar card.PDF"}
                </span>
              </div>
              {/* Edit Icon - Outside the blue box */}
              <button 
                onClick={() => handleEdit(2)}
                className="absolute top-4 right-6 p-2 text-gray-500 hover:text-[#0F62FE] transition-colors"
                title="Edit Government ID"
              >
                <Pencil size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Live Selfie Capture Section */}
        <div className="rounded-lg bg-[#EFF6FF] overflow-hidden">
          <SectionHeader 
            title="Live Selfie Capture" 
            sectionKey="selfie" 
            isExpanded={expandedSections.has("selfie")}
            onToggle={toggleSection}
          />
          {expandedSections.has("selfie") && (
            <div className="px-6 pb-6">
              <div className="h-px w-full bg-gray-200 mb-4"></div>
              <div className="relative flex items-center gap-3">
                {/* Selfie Image */}
                <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {displaySelfieData?.image ? (
                    <Image
                      src={displaySelfieData.image}
                      alt="Selfie"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                {/* Text */}
                <span className="text-sm text-gray-700">
                  Selfie image captured
                </span>
                {/* Edit Icon */}
                <button 
                  onClick={() => handleEdit(3)}
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-[#0F62FE] transition-colors"
                  title="Edit Selfie"
                >
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Address + Terms Section */}
        <div className="rounded-lg bg-[#EFF6FF] overflow-hidden">
          <SectionHeader 
            title="Address + Terms" 
            sectionKey="address" 
            isExpanded={expandedSections.has("address")}
            onToggle={toggleSection}
          />
          {expandedSections.has("address") && (
            <div className="px-6 pb-6">
              <div className="h-px w-full bg-gray-200 mb-4"></div>
              <div className="relative">
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium text-gray-900">
                      Address line 1-{" "}
                    </span>
                    <span className="text-[#0F62FE]">
                      {displayAddressData?.addressLine1 || "Not provided"}
                    </span>
                  </div>
                  {displayAddressData?.addressLine2 && (
                    <div>
                      <span className="font-medium text-gray-900">
                        Address line 2-{" "}
                      </span>
                      <span className="text-[#0F62FE]">
                        {displayAddressData.addressLine2}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-4 flex-wrap">
                    <div>
                      <span className="font-medium text-gray-900">City-</span>
                      <span className="text-[#0F62FE]">
                        {displayAddressData?.city || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">State-</span>
                      <span className="text-[#0F62FE]">
                        {displayAddressData?.state || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Pincode-
                      </span>
                      <span className="text-[#0F62FE]">
                        {displayAddressData?.pincode || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Edit Icon */}
                <button 
                  onClick={() => handleEdit(4)}
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-[#0F62FE] transition-colors"
                  title="Edit Address"
                >
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-auto flex justify-between items-center w-full pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-gray-900 hover:text-[#0F62FE] transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={onSubmit}
          className="flex items-center gap-2 font-semibold text-[#0F62FE] hover:underline transition-colors"
        >
          Submit Application <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
