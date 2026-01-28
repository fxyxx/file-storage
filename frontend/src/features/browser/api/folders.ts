import { api } from '@/api/axios';
import type { FolderItem, CreateFolderDto, FolderWithPath } from '../types/item';

export const createFolder = async (data: CreateFolderDto): Promise<FolderItem> => {
	const payload = { ...data };
	if (!payload.parentId) {
		delete payload.parentId;
	}
	const response = await api.post<FolderItem>('/folders', payload);
	return response.data;
};

export const getFolder = async (id: number): Promise<FolderWithPath> => {
	const { data } = await api.get<FolderWithPath>(`/folders/${id}`);
	return data;
};
