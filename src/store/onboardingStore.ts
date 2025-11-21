import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Type definitions
export interface PersonalInfoData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  division: string;
  role: string;
  profileImage: string | null; // base64 string
}

export interface GovtIdFile {
  id: string;
  fileName: string;
  fileType: string;
  fileData: string; // base64 string for localStorage
  idType: string;
  // Keep original File object in memory for API submission
  file?: File;
}

export interface SelfieData {
  image: string | null; // base64 string
}

export interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  agreedToTerms: boolean;
}

interface OnboardingState {
  // Step data
  personalInfo: PersonalInfoData | null;
  govtIds: GovtIdFile[];
  selfie: SelfieData | null;
  address: AddressData | null;
  
  // Current step
  currentStep: number;
  
  // Actions
  setPersonalInfo: (data: PersonalInfoData) => void;
  setGovtIds: (files: File[], idTypes: string[]) => Promise<void>;
  addGovtId: (file: File, idType: string) => Promise<void>;
  removeGovtId: (id: string) => void;
  updateGovtIdType: (id: string, idType: string) => void;
  setSelfie: (image: string | null) => void;
  setAddress: (data: AddressData) => void;
  setCurrentStep: (step: number) => void;
  
  // Utility actions
  reset: () => void;
  getFormData: () => FormData; // For API submission
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert base64 to File (for API submission)
const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

// Map display ID types to API format
const mapIdTypeToAPI = (displayType: string): string => {
  const mapping: Record<string, string> = {
    "Aadhar Card": "NATIONAL_ID",
    "PAN Card": "TAX_ID",
    "Voter ID": "VOTER_ID",
    "Driving License": "DRIVING_LICENSE",
  };
  return mapping[displayType] || "NATIONAL_ID";
};

const initialState = {
  personalInfo: null,
  govtIds: [],
  selfie: null,
  address: null,
  currentStep: 1,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPersonalInfo: (data: PersonalInfoData) => {
        set({ personalInfo: data });
      },

      setGovtIds: async (files: File[], idTypes: string[]) => {
        const govtIds: GovtIdFile[] = await Promise.all(
          files.map(async (file, index) => {
            const fileData = await fileToBase64(file);
            return {
              id: Date.now().toString() + index,
              fileName: file.name,
              fileType: file.type,
              fileData,
              idType: idTypes[index] || "Aadhar Card",
              file, // Keep original file for API
            };
          })
        );
        set({ govtIds });
      },

      addGovtId: async (file: File, idType: string) => {
        const fileData = await fileToBase64(file);
        const newId: GovtIdFile = {
          id: Date.now().toString(),
          fileName: file.name,
          fileType: file.type,
          fileData,
          idType,
          file, // Keep original file for API
        };
        set((state) => ({
          govtIds: [...state.govtIds, newId],
        }));
      },

      removeGovtId: (id: string) => {
        set((state) => ({
          govtIds: state.govtIds.filter((govtId) => govtId.id !== id),
        }));
      },

      updateGovtIdType: (id: string, idType: string) => {
        set((state) => ({
          govtIds: state.govtIds.map((govtId) =>
            govtId.id === id ? { ...govtId, idType } : govtId
          ),
        }));
      },

      setSelfie: (image: string | null) => {
        set({ selfie: { image } });
      },

      setAddress: (data: AddressData) => {
        set({ address: data });
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      reset: () => {
        set(initialState);
      },

      // Convert store data to FormData for API submission
      getFormData: (): FormData => {
        const state = get();
        const formData = new FormData();

        // Personal Info - map to API field names
        if (state.personalInfo) {
          formData.append("fullName", state.personalInfo.fullName);
          formData.append("phoneNumber", state.personalInfo.phoneNumber);
          formData.append("email", state.personalInfo.email);
          formData.append("city", state.personalInfo.city);
          formData.append("division", state.personalInfo.division);
          formData.append("role", state.personalInfo.role);
          
          // Profile Image
          if (state.personalInfo.profileImage) {
            const file = base64ToFile(
              state.personalInfo.profileImage,
              "profile.jpg",
              "image/jpeg"
            );
            formData.append("profileImage", file);
          }
        }

        // Government ID - API expects single file with type
        // Use the first uploaded ID (or most recent)
        if (state.govtIds.length > 0) {
          const govtId = state.govtIds[0]; // Use first ID
          const file = govtId.file || base64ToFile(
            govtId.fileData,
            govtId.fileName,
            govtId.fileType
          );
          formData.append("governmentId", file);
          formData.append("governmentIdType", mapIdTypeToAPI(govtId.idType));
        }

        // Selfie
        if (state.selfie?.image) {
          const selfieFile = base64ToFile(
            state.selfie.image,
            "selfie.jpg",
            "image/jpeg"
          );
          formData.append("selfie", selfieFile);
        }

        // Address - map to API field names
        if (state.address) {
          formData.append("addressLine1", state.address.addressLine1);
          if (state.address.addressLine2) {
            formData.append("addressLine2", state.address.addressLine2);
          }
          formData.append("state", state.address.state);
          formData.append("postalCode", state.address.pincode); // Map pincode to postalCode
          // Note: API doesn't seem to have a separate city field in address, using city from personalInfo
          
          // Terms accepted - convert boolean to string
          formData.append("termsAccepted", state.address.agreedToTerms ? "true" : "false");
        }

        return formData;
      },
    }),
    {
      name: "onboarding-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields (exclude File objects)
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        govtIds: state.govtIds.map(({ file, ...rest }) => rest), // Exclude File object
        selfie: state.selfie,
        address: state.address,
        currentStep: state.currentStep,
      }),
    }
  )
);

