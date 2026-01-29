import { create } from 'zustand';
import type { UploadItem, UploadStatus } from '../types/upload';

interface UploadState {
	uploads: UploadItem[];
	isMinimized: boolean;
	addUpload: (file: File, folderId: number | null) => string;
	updateProgress: (id: string, progress: number) => void;
	setStatus: (id: string, status: UploadStatus, error?: string) => void;
	removeUpload: (id: string) => void;
	clearCompleted: () => void;
	setMinimized: (minimized: boolean) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
	uploads: [],
	isMinimized: false,

	addUpload: (file, folderId) => {
		const id = self.crypto.randomUUID();
		set((state) => ({
			uploads: [
				...state.uploads,
				{
					id,
					file,
					progress: 0,
					status: 'pending',
					folderId,
				},
			],
		}));
		return id;
	},

	updateProgress: (id, progress) => {
		set((state) => ({
			uploads: state.uploads.map((item) => (item.id === id ? { ...item, progress, status: 'uploading' } : item)),
		}));
	},

	setStatus: (id, status, error) => {
		set((state) => ({
			uploads: state.uploads.map((item) =>
				item.id === id ? { ...item, status, error, progress: status === 'done' ? 100 : item.progress } : item,
			),
		}));
	},

	removeUpload: (id) => {
		set((state) => ({
			uploads: state.uploads.filter((item) => item.id !== id),
		}));
	},

	clearCompleted: () => {
		set((state) => ({
			uploads: state.uploads.filter((item) => item.status !== 'done'),
		}));
	},

	setMinimized: (minimized) => {
		set({ isMinimized: minimized });
	},
}));
