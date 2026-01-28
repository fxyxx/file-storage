import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode } from '../types/item';

interface BrowserState {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
}

export const useBrowserStore = create<BrowserState>()(
	persist(
		(set) => ({
			viewMode: 'grid',
			setViewMode: (mode) => set({ viewMode: mode }),
		}),
		{
			name: 'file-browser-storage',
		},
	),
);
