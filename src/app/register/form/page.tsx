"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PersonalInfoStep, {
  PersonalInfoData,
} from "../../components/PersonalInfoStep";
import GovtIdStep from "../../components/GovtIdStep";
import LiveSelfieStep from "../../components/LiveSelfieStep";
import AddressTermsStep from "../../components/AddressTermsStep";
import ReviewSubmitStep from "../../components/ReviewSubmitStep";
import { useOnboardingStore } from "../../../store/onboardingStore";

const steps = [
  { id: 1, title: "Personal Information" },
  { id: 2, title: "Govt. ID Upload" },
  { id: 3, title: "Live Selfie Capture" },
  { id: 4, title: "Address + Terms" },
  { id: 5, title: "Review & Submit" },
];

export default function RegistrationForm() {
  const {
    currentStep,
    setCurrentStep,
    personalInfo,
    getFormData,
    reset,
  } = useOnboardingStore();

  // Sync local state with store on mount
  useEffect(() => {
    // Store already has currentStep from localStorage
  }, []);

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    // Data is already saved to store by PersonalInfoStep component
    console.log("Personal Info Data:", data);
    setCurrentStep(2);
  };

  const handleGovtIdNext = () => {
    setCurrentStep(3);
  };

  const handleGovtIdBack = () => {
    setCurrentStep(1);
  };

  const handleLiveSelfieNext = () => {
    setCurrentStep(4);
  };

  const handleLiveSelfieBack = () => {
    setCurrentStep(2);
  };

  const handleAddressTermsNext = () => {
    setCurrentStep(5);
  };

  const handleAddressTermsBack = () => {
    setCurrentStep(3);
  };

  const handleSubmitApplication = async () => {
    try {
      console.log("Submitting application...");
      
      // Get FormData from store
      const formData = getFormData();
      
      // Log form data for debugging
      console.log("Form Data:", {
        personalInfo,
        formDataEntries: Array.from(formData.entries()),
      });

      // Submit to API
      const response = await fetch("https://scapi.elitceler.com/api/v1/volunteers/registration", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Submission failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Submission successful:", result);
      
      // Reset store after successful submission
      reset();
      
      alert("Application Submitted Successfully! You will receive your SC Volunteer ID soon.");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`);
    }
  };

  const handleReviewBack = () => {
    setCurrentStep(4);
  };

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Sidebar - 35% width */}
      <div 
        className="relative hidden w-[35%] flex-col p-12 text-white lg:flex justify-center"
        style={{
          background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)",
        }}
      >
        {/* Logo */}
        <div className="absolute top-25 left-35">
          <Image
            src="/bluelogo.png"
            alt="Street Cause Logo"
            width={190}
            height={120}
            className=""
          />
        </div>

        {/* Stepper */}
        <div className="flex w-full flex-row pl-8">
          {/* Left Column: Visuals (Circles + Lines) */}
          <div className="flex flex-col items-center">
            {steps.map((step, index) => (
              <div
                key={`visual-${step.id}`}
                className="flex flex-col items-center"
              >
                {/* Circle */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    currentStep === step.id
                      ? "bg-white text-[#0F62FE] border-white"
                      : currentStep > step.id
                      ? "bg-white text-[#0F62FE] border-white"
                      : "border-white/50 text-white bg-transparent"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {step.id < 10 ? `0${step.id}` : step.id}.
                  </span>
                </div>

                {/* Line */}
                {index !== steps.length - 1 && (
                  <div className="h-12 w-[1px] bg-white/30"></div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Labels */}
          <div className="ml-6 flex flex-col">
            {steps.map((step, index) => (
              <div
                key={`label-${step.id}`}
                className="flex h-10 items-center mb-12 last:mb-0"
              >
                <span
                  className={`text-lg font-medium ${
                    currentStep === step.id ? "text-white" : "text-white/70"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - 65% width */}
      <div className="flex w-full flex-col bg-white px-16 py-8 lg:w-[65%] justify-center">
        {currentStep === 1 && (
          <PersonalInfoStep onNext={handlePersonalInfoNext} />
        )}
        {currentStep === 2 && (
          <GovtIdStep onNext={handleGovtIdNext} onBack={handleGovtIdBack} />
        )}
        {currentStep === 3 && (
          <LiveSelfieStep
            onNext={handleLiveSelfieNext}
            onBack={handleLiveSelfieBack}
          />
        )}
        {currentStep === 4 && (
          <AddressTermsStep
            onNext={handleAddressTermsNext}
            onBack={handleAddressTermsBack}
          />
        )}
        {currentStep === 5 && (
          <ReviewSubmitStep
            onBack={handleReviewBack}
            onSubmit={handleSubmitApplication}
            personalData={personalInfo}
          />
        )}
      </div>
    </div>
  );
}
