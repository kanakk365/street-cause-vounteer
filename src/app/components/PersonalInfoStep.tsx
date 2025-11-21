import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Camera, Upload, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "../../store/onboardingStore";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];
const divisions = [
  "Marketing",
  "Operations",
  "Finance",
  "HR",
  "Technology",
  "Sales",
];
const roles = ["Volunteer", "Team Lead", "Coordinator", "Manager", "Director"];

interface PersonalInfoStepProps {
  onNext?: (data: PersonalInfoData) => void;
}

export interface PersonalInfoData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  division: string;
  role: string;
  profileImage: string | null;
}

export default function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { personalInfo, setPersonalInfo } = useOnboardingStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    personalInfo?.profileImage || null
  );
  const [formData, setFormData] = useState<PersonalInfoData>({
    fullName: personalInfo?.fullName || "",
    phoneNumber: personalInfo?.phoneNumber || "",
    email: personalInfo?.email || "",
    city: personalInfo?.city || "",
    division: personalInfo?.division || "",
    role: personalInfo?.role || "",
    profileImage: personalInfo?.profileImage || null,
  });

  const [dropdownStates, setDropdownStates] = useState({
    city: false,
    division: false,
    role: false,
  });

  const [dropdownPosition, setDropdownPosition] = useState({
    city: "below",
    division: "below",
    role: "below",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cityButtonRef = useRef<HTMLButtonElement>(null);
  const divisionButtonRef = useRef<HTMLButtonElement>(null);
  const roleButtonRef = useRef<HTMLButtonElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (6MB max)
      if (file.size > 6 * 1024 * 1024) {
        alert("File size must be less than 6MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPEG/PNG)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        const updated = { ...formData, profileImage: imageData };
        setFormData(updated);
        // Update store
        setPersonalInfo(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    // Update store in real-time
    setPersonalInfo(updated);
  };

  const toggleDropdown = (dropdown: "city" | "division" | "role") => {
    const newState = {
      city: dropdown === "city" ? !dropdownStates.city : false,
      division: dropdown === "division" ? !dropdownStates.division : false,
      role: dropdown === "role" ? !dropdownStates.role : false,
    };

    setDropdownStates(newState);

    // Calculate if dropdown should open upward or downward
    if (newState[dropdown]) {
      const buttonRef =
        dropdown === "city"
          ? cityButtonRef
          : dropdown === "division"
          ? divisionButtonRef
          : roleButtonRef;

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 192; // max-h-48 = 12rem = 192px
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Open upward if not enough space below and more space above
        const shouldOpenUpward =
          spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

        setDropdownPosition((prev) => ({
          ...prev,
          [dropdown]: shouldOpenUpward ? "above" : "below",
        }));
      }
    }
  };

  const selectOption = (
    dropdown: "city" | "division" | "role",
    value: string
  ) => {
    handleInputChange(dropdown, value);
    setDropdownStates((prev) => ({ ...prev, [dropdown]: false }));
  };

  const handleNext = () => {
    // Ensure store is updated
    setPersonalInfo(formData);
    if (onNext) {
      onNext(formData);
    }
  };

  return (
    <div className="w-full mx-auto max-w-4xl my-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 1 of 5</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add your <span className="text-[#0F62FE]">Personal Information</span>
        </h1>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-6 flex items-center gap-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-[#0F62FE] overflow-hidden hover:bg-blue-100 transition-colors cursor-pointer group"
        >
          {profileImage ? (
            <>
              <Image
                src={profileImage}
                alt="Profile preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={24} className="text-white" />
              </div>
            </>
          ) : (
            <Camera size={32} />
          )}
        </button>
        <div>
          <h3 className="font-medium text-gray-900">
            Upload a profile picture
          </h3>
          <p className="text-sm text-gray-400">JPEG/PNG, maximum 6MB</p>
        </div>
      </div>

      {/* Form Fields */}
      <form
        className="flex max-w-xl flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Full Name */}
        <div className="group relative">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-blue-400 outline-none placeholder:text-gray-400 focus:border-[#0F62FE]"
          />
        </div>

        {/* Phone Number */}
        <div className="group relative">
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-blue-400 outline-none placeholder:text-gray-400 focus:border-[#0F62FE]"
          />
        </div>

        {/* Email */}
        <div className="group relative">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-blue-400 outline-none placeholder:text-gray-400 focus:border-[#0F62FE]"
          />
        </div>

        {/* City Dropdown */}
        <div className="group relative">
          <button
            ref={cityButtonRef}
            type="button"
            onClick={() => toggleDropdown("city")}
            className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
          >
            <span className={formData.city ? "text-blue-400" : "text-gray-400"}>
              {formData.city || "City"}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${
                dropdownStates.city ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownStates.city && (
            <div
              className={`absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto ${
                dropdownPosition.city === "above" ? "bottom-full mb-1" : "mt-1"
              }`}
            >
              {cities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectOption("city", city)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-900 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Division/Unit Dropdown */}
        <div className="group relative">
          <button
            ref={divisionButtonRef}
            type="button"
            onClick={() => toggleDropdown("division")}
            className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
          >
            <span
              className={formData.division ? "text-blue-400" : "text-gray-400"}
            >
              {formData.division || "Division/Unit"}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${
                dropdownStates.division ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownStates.division && (
            <div
              className={`absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto ${
                dropdownPosition.division === "above"
                  ? "bottom-full mb-1"
                  : "mt-1"
              }`}
            >
              {divisions.map((division) => (
                <button
                  key={division}
                  type="button"
                  onClick={() => selectOption("division", division)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-900 transition-colors"
                >
                  {division}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="group relative">
          <button
            ref={roleButtonRef}
            type="button"
            onClick={() => toggleDropdown("role")}
            className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
          >
            <span className={formData.role ? "text-blue-400" : "text-gray-400"}>
              {formData.role || "Role"}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${
                dropdownStates.role ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownStates.role && (
            <div
              className={`absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto ${
                dropdownPosition.role === "above" ? "bottom-full mb-1" : "mt-1"
              }`}
            >
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectOption("role", role)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-900 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Next Button */}
      <div className="mt-auto flex justify-end pt-6 mt-4 max-w-xl w-full">
        <button
          onClick={handleNext}
          className="flex items-center gap-2 font-semibold text-[#0F62FE] hover:underline"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
