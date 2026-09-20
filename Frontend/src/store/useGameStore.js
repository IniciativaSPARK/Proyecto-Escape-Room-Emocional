import { create } from 'zustand';

export const useGameStore = create((set) => ({
    selectedObject : null,
    setSelectedObject: (objData) => set({ selectedObject: objData }),
    clearSelectedObject: () =>set({ selectedObject: null }),

}));


