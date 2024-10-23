import { create } from 'zustand';
import { ColorsResponse } from '../interfaces';

interface ColorState {
  // State
  colorOptions: ColorsResponse[];
  color: string;
  isLoading: boolean;

  // Actions
  setColorOptions: (colorOptions: ColorsResponse[]) => void;
  setColor: (color: string) => void;
  setIsLoading: (isLoading: boolean) => void;

}

export const useColorStore = create<ColorState>((set) => ({
  // State
  colorOptions: [],
  color: '000000',
  isLoading: false,

  // Actions
  setColorOptions: (colorOptions: ColorsResponse[]) => set({ colorOptions }),
  setColor: (color: string) => set({ color }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));