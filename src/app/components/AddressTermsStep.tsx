import { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useOnboardingStore } from "../../store/onboardingStore";

interface AddressTermsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressTermsStep({
  onNext,
  onBack,
}: AddressTermsStepProps) {
  const { address, setAddress } = useOnboardingStore();
  const [formData, setFormData] = useState({
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    agreedToTerms: address?.agreedToTerms || false,
  });

  const [dropdownStates, setDropdownStates] = useState({
    city: false,
    state: false,
  });

  const cities = ["Hyderabad", "Mumbai", "Delhi", "Bangalore", "Chennai"];
  const states = [
    "Telangana",
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
  ];

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    // Update store in real-time
    setAddress({
      addressLine1: updated.addressLine1,
      addressLine2: updated.addressLine2,
      city: updated.city,
      state: updated.state,
      pincode: updated.pincode,
      agreedToTerms: updated.agreedToTerms,
    });
  };

  const toggleDropdown = (dropdown: "city" | "state") => {
    setDropdownStates((prev) => ({
      city: dropdown === "city" ? !prev.city : false,
      state: dropdown === "state" ? !prev.state : false,
    }));
  };

  const selectOption = (dropdown: "city" | "state", value: string) => {
    handleInputChange(dropdown, value);
    setDropdownStates((prev) => ({ ...prev, [dropdown]: false }));
  };

  const isFormValid =
    formData.addressLine1 &&
    formData.city &&
    formData.state &&
    formData.pincode &&
    formData.agreedToTerms;

  return (
    <div className="w-full mx-auto max-w-5xl my-auto flex flex-col h-full">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 4 of 5</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add{" "}
          <span className="text-[#0F62FE]">Address + Terms & Conditions</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Provide your current residential address and accept the terms to
          continue.
        </p>
      </div>

      <form className="flex max-w-2xl flex-col gap-6 mb-4">
        {/* Address Line 1 */}
        <div className="group relative">
          <input
            type="text"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-[#0F62FE] outline-none placeholder:text-gray-400 focus:border-[#0F62FE] transition-colors"
          />
        </div>

        {/* Address Line 2 */}
        <div className="group relative">
          <input
            type="text"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-[#0F62FE] outline-none placeholder:text-gray-400 focus:border-[#0F62FE] transition-colors"
          />
        </div>

        {/* City Dropdown */}
        <div className="group relative">
          <button
            type="button"
            onClick={() => toggleDropdown("city")}
            className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
          >
            <span
              className={formData.city ? "text-[#0F62FE]" : "text-gray-400"}
            >
              {formData.city || "City"}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${
                dropdownStates.city ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownStates.city && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
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

        {/* State Dropdown */}
        <div className="group relative">
          <button
            type="button"
            onClick={() => toggleDropdown("state")}
            className="flex w-full items-center justify-between border-b border-gray-300 py-2 text-left outline-none focus:border-[#0F62FE]"
          >
            <span
              className={formData.state ? "text-[#0F62FE]" : "text-gray-400"}
            >
              {formData.state || "State"}
            </span>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${
                dropdownStates.state ? "rotate-180" : ""
              }`}
            />
          </button>
          {dropdownStates.state && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
              {states.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => selectOption("state", state)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-900 transition-colors"
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pincode */}
        <div className="group relative">
          <input
            type="text"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            className="w-full border-b border-gray-300 py-2 text-[#0F62FE] outline-none placeholder:text-gray-400 focus:border-[#0F62FE] transition-colors"
          />
        </div>

        {/* Terms & Conditions Box */}
        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 mb-2">Terms & Conditions</h3>
          <p className="text-xs text-gray-500  mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque mattis nibh ac pulvinar consectetur. Morbi elementum
            augue vel neque tristique vulputate. Aliquam euismod, libero eu
          </p>
          <button
            type="button"
            className="text-xs text-[#0F62FE] font-medium hover:underline"
          >
            View Full Terms
          </button>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              handleInputChange("agreedToTerms", !formData.agreedToTerms)
            }
            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
              formData.agreedToTerms
                ? "bg-[#0F62FE] border-[#0F62FE]"
                : "border-gray-300 bg-white"
            }`}
          >
            {formData.agreedToTerms && (
              <Check size={14} className="text-white" />
            )}
          </button>
          <span className="text-sm text-gray-600">
            I have read and agree to the Terms & Conditions.
          </span>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="mt-auto flex justify-between items-center max-w-4xl w-full pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-gray-900 hover:text-[#0F62FE] transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={() => {
            // Ensure store is updated
            setAddress({
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              agreedToTerms: formData.agreedToTerms,
            });
            onNext();
          }}
          disabled={!isFormValid}
          className={`flex items-center gap-2 font-semibold transition-colors ${
            isFormValid
              ? "text-[#0F62FE] hover:underline"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
