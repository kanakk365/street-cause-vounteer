import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  registrationCode: string | null;
  setAuth: (accessToken: string, registrationCode?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      registrationCode: null,
      setAuth: (accessToken: string, registrationCode?: string) => {
        set({ accessToken, registrationCode: registrationCode || null });
      },
      clearAuth: () => {
        set({ accessToken: null, registrationCode: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

