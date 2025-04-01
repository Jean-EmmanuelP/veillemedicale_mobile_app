import { create } from 'zustand';

interface PaywallStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const usePaywall = create<PaywallStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
})); 