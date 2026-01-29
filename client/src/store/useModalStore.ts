import { create } from 'zustand';
import type { UserRole } from '@/types/user';
import type { ResourceType } from '@/types/resource';

type ModalView = 'DELETE_ITEM' | 'RENAME_ITEM' | 'SHARE_ACCESS' | 'PREVIEW_FILE' | null;

interface ModalData {
	id: number;
	name: string;
	type: ResourceType;
	userRole?: UserRole;
}

interface ModalState {
	isOpen: boolean;
	view: ModalView;
	data: ModalData | null;
	openModal: (view: ModalView, data: ModalData) => void;
	closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isOpen: false,
	view: null,
	data: null,
	openModal: (view, data) => set({ isOpen: true, view, data }),
	closeModal: () => set({ isOpen: false, view: null, data: null }),
}));
