import { api } from '@/api/axios';
import type { FileSystemItem, FileItem, FolderItem } from '../types/item';
import type { ResourceType } from '@/types/resource';

export const deleteItem = async (type: ResourceType, id: number): Promise<void> => {
	if (type === 'FOLDER') {
		await api.delete(`/folders/${id}`);
	} else {
		await api.delete('/files', { params: { ids: String(id) } });
	}
};

export const renameItem = async (type: ResourceType, id: number, name: string): Promise<FileSystemItem> => {
	if (type === 'FOLDER') {
		const { data } = await api.patch<Omit<FolderItem, 'type'>>(`/folders/${id}`, { name });
		return { ...data, type: 'FOLDER' };
	} else {
		const { data } = await api.patch<Omit<FileItem, 'type'>>(`/files/${id}`, { name });
		return { ...data, type: 'FILE' };
	}
};

export const copyItem = async (type: ResourceType, id: number): Promise<void> => {
	if (type === 'FILE') {
		await api.post(`/files/${id}/copy`);
	}
};
