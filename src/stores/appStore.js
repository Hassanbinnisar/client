import { create } from 'zustand';

export const useAppStore = create((set) => ({
  showCartModal: false,
  setShowCartModal: (show) => set({ showCartModal: show })
}));

