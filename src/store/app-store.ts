import { create } from 'zustand';

type AppState = {
  companyId: string;
  sidebarOpen: boolean;
  setCompanyId: (companyId: string) => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  companyId: 'all',
  sidebarOpen: false,
  setCompanyId: (companyId) => set({ companyId }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
